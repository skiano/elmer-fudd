const { test, assert } = require('elmer-fudd');

test({
  name: 'My First Magic Number',
  unit: '@src/magicNumber',
  spec: async (number) => {
    assert.equal(number, 42, 'should equal 42');
  }
});

test({
  name: 'My Second Magic Number',
  unit: '@src/magicNumber',
  spec: async () => {
    assert.deepEqual({ foo: 1, bar: 2 }, { foo: 1 });
    // assert.ok(true);
  }
});

test({
  name: 'My super minimal example test',
  spec: () => {
    assert.ok(true);
  }
});
