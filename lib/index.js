const path = require('path');
const stackTrace = require('stack-trace');
const addHook = require('pirates').addHook;

let id = 0;
const queue = [];

exports.run = async (tests) => {
  const results = [];
  while (queue.length) {
    try {
      // TODO: run in parallel batches?
      const runTest = queue.shift();
      console.log('running', runTest);
      const result = await runTest();
      results.push(result);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
  return results;
};

exports.test = (title, { unit, mock = {} }, fn) => {
  const globalName = '__M0K__' + id++;

  const site = stackTrace.get()
    .find(s => s.getFileName() !== __filename)
    .getFileName();

  const resolve = (relativePath) => {
    return require.resolve(path.resolve(path.dirname(site), relativePath));
  }

  const runTest = async () => {
    global[globalName] = {};

    for (let s in mock) {
      const resolved = resolve(s);
      delete require.cache[resolved]
      global[globalName][resolved] = mock[s];
    }

    const removeHook = addHook((code, filename) => {
      return `module.exports = global.${globalName}['${filename}']`;
    }, {
      matcher: (f) => global[globalName].hasOwnProperty(f),
    })

    const unitPath = resolve(unit);
    delete require.cache[unitPath];
    const unitWithMocks = require(unitPath);

    removeHook(); // remove before running to allow parallel tests?

    let result;

    try {
      await fn(unitWithMocks);
      result = {
        title: title,
        passed: true,
      };
    } catch (error) {
      result = {
        title: title,
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
