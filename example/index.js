const path = require('path');
const addHook = require('pirates').addHook;

// Make the examples look more realistic...
// by allowing require('elmer-fudd');
const FILE_ELMER_FUDD = require.resolve('..');
const DIR_TESTS = path.join(__dirname, 'tests');
const fuddRequire = `require('${FILE_ELMER_FUDD}')`;
addHook(
  function transform(code) {
    return code
      .replace(`require('elmer-fudd')`, fuddRequire)
      .replace(`require("elmer-fudd")`, fuddRequire);
  },
  {
    matcher: f => {
      return f.startsWith(DIR_TESTS);
    } 
  }
);

const { run } = require(FILE_ELMER_FUDD);

run({
  ext: '.test.js',
  root: DIR_TESTS,
  alias: {
    '@src': path.join(__dirname, 'src'),
  },
});
