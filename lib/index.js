const path = require('path');
const stackTrace = require('stack-trace');
const addHook = require('pirates').addHook;

let id = 0;
const queue = [];

exports.run = async (options) => {
  // default home?
  const results = [];
  while (queue.length) {
    try {
      // TODO: run in parallel batches?
      const runTest = queue.shift();
      const result = await runTest(options);
      results.push(result);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
  return results;
};

exports.test = (...mocks) => {
  const fn = mocks.pop();
  const globalName = '__M0K__' + id++;
  const site = stackTrace.get()
    .find(s => s.getFileName() !== __filename)
    .getFileName();

  mocks = mocks.map(mock => (Array.isArray(mock) ? mock : [mock]));

  const runTest = async (options = {}) => {
    const testName = path.relative(options.home, site);

    const resolve = (req) => {
      return req.startsWith('.')
        ? require.resolve(path.resolve(path.dirname(site), req))
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

    const removeHook = addHook((code, filename) => {
      return `module.exports = global.${globalName}['${filename}']`;
    }, {
      matcher: (f) => global[globalName].hasOwnProperty(f),
    })

    bustCached();
    const injected = mocks.map(mock => require(resolve(mock[0])));
    bustCached();
    removeHook();

    let result;
    try {
      await fn(...injected);
      result = {
        testName,
        passed: true,
      };
    } catch (error) {
      result = {
        testName,
        passed: false,
        reason: error,
      };
    }

    delete global[globalName];
    return result;
  };

  runTest.mocks = globalName;
  queue.push(runTest);
};
