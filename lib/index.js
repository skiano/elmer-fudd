const ah = require('async_hooks');
const path = require('path');
const assert = require('assert').strict;
const pirates = require('pirates');
const stackTrace = require('stack-trace');

let mock = 0;
const queue = [];
const domains = {};

/*******/
/* RUN */
/*******/

exports.run = async (options) => {
  const domainHook = ah.createHook({
    init(id, _, triggerId) {
      const current = domains[triggerId];
      if (current) {
        current.ids.add(id);
        domains[id] = current;
      }
    },
    destroy (id) {
      const domain = domains[id]
      if (!domain) return;
      delete domains[id];
    },
  })

  domainHook.enable();

  const results = {
    passed: true,
    suites: {},
  };

  while (queue.length) {
    try {
      const runTest = queue.shift(); // TODO: run in parallel batches?
      const result = await runTest(options);

      if (result.failed) results.passed = false;
      if (!results.suites[result.suite]) results.suites[result.suite] = { passed: 0, failed: 0, tests: [] };
      results.suites[result.suite].tests.push(result);
      results.suites[result.suite].passed += result.passed;
      results.suites[result.suite].failed += result.failed;
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  domainHook.disable();

  return results;
};

/**********/
/* REPORT */
/**********/

exports.report = (results) => {
  const width = 71;
  const msg = (txt = '') => { console.log(`   ${txt}`); };
  const bar = (txt) => { msg(txt.repeat(Math.ceil(width / txt.length)).slice(0, width)); };
  const lineBreak = () => { msg(''); }
  const justify = (a, b) => { msg(`${a.padEnd(width - b.length)}${b}`); }
  const justifyLined = (a, b) => { msg(`${a.padEnd(width - b.length, '.')}${b}`); }
  const testName = (test) => test.name || `Test @ line ${test.site.getLineNumber()}`;

  const suiteNames = Object.keys(results.suites);

  lineBreak();

  let testCount = 0;
  const failures = [];

  suiteNames.forEach((suiteName, i) => {
    const suite = results.suites[suiteName];

    bar(`=`);
    justify(suiteName, `passed: ${suite.passed} failed: ${suite.failed}`);
    bar(`-`);
    lineBreak();

    suite.tests.forEach((test) => {
      const name = testName(test);
      if (test.failed) {
        justifyLined(`- ${name} `, ' fail ✘');
        failures.push(test);
      } else {
        msg(`- ${name} `);
      }
      
      testCount += 1;
    });

    if (i < suiteNames.length - 1) lineBreak();
  });

  lineBreak();
  bar(`^~`);
  bar(`~^`);
  bar(`=`);
  justify(
    `Tested : Suites (${suiteNames.length}) Tests (${testCount})`,
    results.passed ? 'result: PASSED' : 'result: FAILED');
  bar(`_`);

  if (failures.length) {
    lineBreak();
    lineBreak();
    lineBreak();

    const fileCache = {};

    failures.forEach((fail) => {
      fail.errors.forEach(err => {
        bar('X');
        msg(`FAILURE ${testName(fail)}`);
        bar('-');
        lineBreak();

        err.stack.split('\n').forEach(msg);

        const errSite = stackTrace.parse(err)[0];
        if (
          fail.site.getFileName() === errSite.fileName &&
          fail.site.getLineNumber() < errSite.lineNumber
        ) {
          if (!fileCache[errSite.fileName]) {
            fileCache[errSite.fileName] = require('fs').readFileSync(errSite.fileName).toString().split('\n');
          }

          const content = fileCache[errSite.fileName];

          lineBreak();
          bar('-');
          msg(`>   ${errSite.fileName}`)
          msg(`>`)
          for (let i = fail.site.getLineNumber() + 1; i <= errSite.lineNumber + 2; i++) {
            const isBadLine = i === errSite.lineNumber - 1;
            msg(`> ${i.toString().padStart(4)} ${isBadLine ? '✘' : ' '} ${content[i]}`);
          }
          bar('-');
        }

        
        lineBreak();
        lineBreak();
      })
    })
  }

  lineBreak();
};

/********/
/* TEST */
/********/

exports.test = (...mocks) => {
  const testfn = mocks.pop();
  const globalName = '__M0K__' + mock++;
  const site = stackTrace.get(exports.test)[0];

  mocks = mocks.map(mock => (Array.isArray(mock) ? mock : [mock]));

  const runTest = async (options = {}) => {
    // TODO: handle aliases...
    const resolve = (req) => {
      return req.startsWith('.')
        ? require.resolve(path.resolve(path.dirname(site.getFileName()), req))
        : require.resolve(path.resolve(options.root, req));
    };

    const bustCached = () => {
      mocks.forEach((mock) => {
        delete require.cache[resolve(mock[0])];
      });
    };

    global[globalName] = {};
    mocks.forEach((mock) => {
      if (mock[1]) {
        global[globalName][resolve(mock[0])] = mock[1];
      }
    });

    const removeHook = pirates.addHook((code, filename) => {
      return `module.exports = global.${globalName}['${filename}']`;
    }, {
      matcher: (f) => global[globalName].hasOwnProperty(f),
    })

    bustCached();
    const injected = mocks.map(mock => require(resolve(mock[0])));
    bustCached();
    removeHook();

    let result = {
      name: testfn.name, // use a the test name function as a backup if available
      site: site,
      suite: path.relative(options.home, site.getFileName()),
      passed: 0,
      failed: 0,
      errors: [],
    };
    const domainId = ah.executionAsyncId();
    domains[domainId] = { ids: new Set([domainId]), result };

    try {
      await testfn(...injected);
    } catch (error) {
      result.errors.push(error);
      result.failed += 1;
    }

    if (!result.passed) {
      result.errors.push(new Error([
        'tests require at least 1 assertion',
        `    at ${site.getFileName()} line ${site.getLineNumber()}\n`
      ].join('\n')));
    }

    delete global[globalName];
    return result;
  };

  runTest.mocks = globalName;
  queue.push(runTest);
};

/**********/
/* ASSERT */
/**********/

const wrappedAssert = {};
for (let m in assert) {
  wrappedAssert[m] = async function(...args) {
    const domain = domains[ah.executionAsyncId()];
    try {
      await assert[m].apply(assert, args);
      domain.result.passed += 1;
    } catch (error) {
      domain.result.failed += 1;
      domain.result.errors.push(new assert.AssertionError({
        message: error.message,
        actual: error.actual,
        expected: error.expected,
        operator: error.operator,
        stackStartFn: wrappedAssert[m], // omit the wrapped function from the stack
      }));
    }
  }
}
exports.assert = wrappedAssert;

/********/
/* NAME */
/********/

exports.name = (testName) => {
  const domain = domains[ah.executionAsyncId()];
  if (!domain) throw new Error('you must call name() inside a test body');
  domain.result.name = testName;
}