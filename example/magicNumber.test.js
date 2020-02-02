const { test, assert } = require('..');

test(
  './magicNumber',
  async (number) => {
    assert.equal(number, 42, 'should equal 42');
  }
);
