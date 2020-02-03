const { test, assert } = require('..');

test(
  './magicNumber',
  async function MyCoolTest(number) {
    assert.equal(number, 41, 'should equal 42');
  }
);
