const { test, assert, name } = require('elmer-fudd');

test(
  '@src/magicNumber',
  async function MyCoolTest(number) {
    assert.equal(number, 42, 'should equal 42');
  }
);

test(
  '@src/magicNumber',
  async function () {
    name('MY TEST IS GREAT!');
    assert.deepEqual({ foo: 1, bar: 2 }, { foo: 1 });
    assert.ok(true);
  }
);
