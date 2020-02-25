const path = require('path');
const addHook = require('pirates').addHook;

// Make the examples look more realistic by allowing require('elmer-fudd');
const fuddRequire = `require('${require.resolve('..')}')`;

addHook(
  function transform(code) {
    return code
      .replace(`require('elmer-fudd')`, fuddRequire)
      .replace(`require("elmer-fudd")`, fuddRequire);
  },
  {
    matcher: f => {
      return f.startsWith(__dirname);
    } 
  }
);
