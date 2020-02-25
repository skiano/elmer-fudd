const bar = require('./bar');

module.exports = function foo(value) {
  return {
    value: value,
    bar: bar(value),
  };
};
