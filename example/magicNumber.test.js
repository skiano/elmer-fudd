const { test, assert } = require('..');

test(
  './magicNumber',
  async function MyCoolTest(number) {
    assert.equal(number, 42, 'should equal 42');
  }
);
