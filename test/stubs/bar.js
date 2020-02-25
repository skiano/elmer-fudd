const baz = require('./baz');

module.exports = function bar(value) {
  return {
    value: value * 2,
    baz: baz(value * 2),
  };
};
