const { test, assert } = require('..');

test(
  './magicNumber',
  async function MyCoolTest(number) {
    assert.equal(number, 42, 'should equal 42');
  }
);

test(
  './magicNumber',
  async function () {
    // assert.deepEqual({ foo: 1, bar: 2 }, { foo: 1 });
    assert.ok(true);
  }
);