const fs = require('fs').promises;
const ah = require('async_hooks');
const path = require('path');
const assert = require('assert').strict;
const pirates = require('pirates');
const stackTrace = require('stack-trace');

const queue = [];
const domains = {};

/*******/
/* RUN */
/*******/

exports.run = async (options = {}) => {
  if (options.root) {
    const testFiles = await exports.locate(options);
    testFiles.forEach(require);
  }

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

  if (options.raw) {
    return results;
  }

  exports.report(results);
  if (!results.passed) process.exit(1);
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
  const center = (txt) => { msg(txt.padStart(Math.floor(width / 2 + txt.length / 2))); }
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
    center('... FAILURES ...');
    lineBreak();
    lineBreak();

    const fileCache = {};

    failures.forEach((fail) => {
      fail.errors.forEach(err => {
        bar('X');
        msg(`FAILURE ${fail.suite} / ${testName(fail)}`);
        bar('-');
        lineBreak();

        // PRINT THE STACK
        err.stack.split('\n').forEach(msg);

        // MAKE A CODE FRAME SORTA THING
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
          msg(`>   ${path.relative(process.cwd(), errSite.fileName)}`);
          msg(`>`);
          for (let i = fail.site.getLineNumber() - 1; i <= errSite.lineNumber + 2; i++) {
            const isBadLine = i === errSite.lineNumber - 1;
            msg(`> ${(i + 1).toString().padStart(4)} ${isBadLine ? '✘' : ' '} ${content[i] || ''}`);
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

let testId = 0;

exports.test = ({ name, unit, mock, spec }) => {
  const site = stackTrace.get(exports.test)[0]; // NOTE: this stack handling makes it hard to support an array of tests

  const runTest = async (options = {}) => {
    const globalName = '__M0K__' + testId++;
    global[globalName] = {};

    const resolve = (req) => {
      if (options.alias) {
        for (let a in options.alias) {
          if (req.startsWith(a)) {
            return require.resolve(req.replace(a, options.alias[a]));
          }
        }
      }
      return req.startsWith('.')
        ? require.resolve(path.resolve(path.dirname(site.getFileName()), req))
        : require.resolve(req);
    };
    const get = (p) => p && require(resolve(p));
    const bust = (p) => p && delete require.cache[resolve(p)];
    const expose = (p, v) => global[globalName][resolve(p)] = v;
    const mapMock = (fn) => mock && mock.map(([p, v]) => fn(p, v));

    const removeMockHook = pirates.addHook((_, filename) => {
      return `module.exports = global.${globalName}['${filename}']`;
    }, {
      ignoreNodeModules: false, // should this only be true if we actually have an absolute mock?
      matcher: (f) => global[globalName].hasOwnProperty(f),
    });

    bust(unit);
    mapMock(bust);
    mapMock(expose);

    const injectedMocks = mapMock(get);
    const injectedUnit = get(unit);

    bust(unit);
    mapMock(bust);
    removeMockHook();

    const result = {
      name: name,
      site: site,
      suite: path.relative(process.cwd(), site.getFileName()),
      passed: 0,
      failed: 0,
      errors: [],
    };

    const domainId = ah.executionAsyncId();
    domains[domainId] = { ids: new Set([domainId]), result };

    try {
      await spec(injectedUnit, injectedMocks);
    } catch (error) {
      result.errors.push(error);
      result.failed += 1;
    }

    if (!result.passed && !result.failed) {
      result.failed += 1;
      result.errors.push(new Error([
        'tests require at least 1 assertion',
        `    at ${site.getFileName()} line ${site.getLineNumber()}\n`
      ].join('\n')));
    }

    delete global[globalName];
    return result;
  };

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

/**********/
/* LOCATE */
/**********/

exports.locate = async (options) => {
  const handleFiles = async (files, list = []) => {
    const handle = async (f) => {
      const s = await fs.lstat(f);
      if (s.isDirectory() && !f.includes('node_modules')) {
        const files = await fs.readdir(f);
        const children = files.map(c => path.join(f, c));
        return handleFiles(children, list);
      } else {
        if (f.endsWith(options.ext)) {
          list.push(f);
        }
      }
    }
    await Promise.all(files.map(handle));
    return list;
  }

  return handleFiles([options.root]);
}

/*****************/
/* MOCK FUNCTION */
/*****************/

exports.mockFn = () => {
  let calls = [];
  let implementation;
  let returnValue;
  let error;
  let hasReturn = false;

  const fn = (...args) => {
    calls.push(args);
    if (error) throw error;
    if (returnValue) return returnValue;
    if (implementation) return implementation(...args);
  };

  fn.reset = () => {
    calls = [];
    error = undefined;
    implementation = undefined;
    returnValue = undefined;
    hasReturn = false;
  };

  fn.calledWith = (...args) => {
    return calls.some(c => {
      try {
        assert.deepEqual(c, args);
        return true;
      } catch (_) {}
    });
  };

  fn.returns = (value) => {
    if (implementation) throw new Error('You already have a mock implementation');
    returnValue = value;
    hasReturn = true;
    return fn;
  };

  fn.implementation = (value) => {
    if (hasReturn) throw new Error('You already have a mock return value');
    if (typeof value !== 'function') throw new Error('Your mock implementation must be a function');
    implementation = value;
    return fn;
  };

  fn.throws = (e) => {
    error = e;
    return fn;
  };

  fn.will = (directions) => {
    directions = Array.is(directions) ? directions : [directions];
    return fn.implementation((...args) => {
      const d = directions.find((dir) => {
        try {
          assert.deepEqual(dir.given, args);
          return true;
        } catch (_) {}
      });
      if (d) return d.ouput;
    });
  };

  fn.resolves = (val) => {
    fn.returns(Promise.resolve(val));
    return fn;
  };

  fn.rejects = (e) => {
    fn.returns(Promise.reject(e));
    return fn;
  };

  Object.defineProperties(fn, {
    calls: {
      get() {
        return [...calls];
      },
    },
    count: {
      get() {
        return calls.length;
      },
    }
  });

  return fn;
}
