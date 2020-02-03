const ah = require('async_hooks');
const path = require('path');
const assert = require('assert').strict;
const pirates = require('pirates');
const stackTrace = require('stack-trace');

let mock = 0;
const queue = [];
const domains = {};

const wrappedAssert = {};
for (let m in assert) {
  wrappedAssert[m] = async function(...args) {
    const domain = domains[ah.executionAsyncId()];
    try {
      await assert[m].apply(assert, args);
      domain.result.passed += 1;
    } catch (error) {
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

exports.run = async (options) => {
  const domainHook = ah.createHook({
    init(id, type, triggerId, resource) {
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
      // TODO: run in parallel batches?
      const runTest = queue.shift();
      const result = await runTest(options);

      if (!results.suites[result.suite]) {
        results.suites[result.suite] = { passed: 0, tests: [] };
      }

      results.suites[result.suite].tests.push(result);
      results.suites[result.suite].passed += result.passed;
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  domainHook.disable();

  return results;
};

exports.test = (...mocks) => {
  const fn = mocks.pop();
  const globalName = '__M0K__' + mock++;
  const site = stackTrace.get().find(s => s.getFileName() !== __filename);

  mocks = mocks.map(mock => (Array.isArray(mock) ? mock : [mock]));

  const runTest = async (options = {}) => {
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
      site: site,
      suite: path.relative(options.home, site.getFileName()),
      passed: 0,
      errors: [],
    };
    const domainId = ah.executionAsyncId();
    domains[domainId] = { ids: new Set([domainId]), result };

    try {
      await fn(...injected);
    } catch (error) {
      result.errors.push(error);
    }

    if (!result.passed) {
      result.errors.push(new Error('Every test requires at least 1 assertion'));
    }

    delete global[globalName];
    return result;
  };

  runTest.mocks = globalName;
  queue.push(runTest);
};
