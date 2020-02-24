const { test, assert } = require('elmer-fudd');

test({
  name: 'Test Mocked 12',
  unit: '@src/isMagicNumber',
  mock: [
    ['@src/magicNumber', 12],
  ],
  spec: (isMagicNumber) => {
    assert.ok(isMagicNumber(12));
  }
});

test({
  name: 'Test Real Dep',
  unit: '@src/isMagicNumber',
  spec: (isMagicNumber) => {
    assert.ok(isMagicNumber(42), 'should be 42');
  }
});

test({
  name: 'Test Mocked 14',
  unit: '@src/isMagicNumber',
  mock: [
    ['@src/magicNumber', 14],
  ],
  spec: (isMagicNumber) => {
    assert.ok(isMagicNumber(14));
  }
});
