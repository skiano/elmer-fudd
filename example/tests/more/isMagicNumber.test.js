const { test, name, assert } = require('elmer-fudd');

test(
  '@src/isMagicNumber',
  ['@src/magicNumber', 12],
  async (isMagicNumber) => {
    name('Test 1');
    assert.ok(isMagicNumber(12));
  }
);

test(
  '@src/isMagicNumber',
  async (isMagicNumber) => {
    name('Test 2');
    assert.ok(isMagicNumber(42), 'should be 42');
  }
);

test(
  '@src/isMagicNumber',
  ['@src/magicNumber', 14],
  async (isMagicNumber) => {
    name('Test 3');
    assert.ok(isMagicNumber(14));
  }
);

