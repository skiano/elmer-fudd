const { test, name, assert } = require('../../../lib');

test(
  './isMagicNumber',
  ['./magicNumber', 12],
  async (isMagicNumber) => {
    name('Test 1');
    assert.ok(isMagicNumber(12));
    assert.ok(isMagicNumber(12));
  }
);

test(
  './isMagicNumber',
  async (isMagicNumber) => {
    name('Test 2');
    assert.ok(isMagicNumber(43), 'should be 42');
  }
);

test(
  './isMagicNumber',
  ['./magicNumber', 14],
  async (isMagicNumber) => {
    name('Test 3');
    assert.ok(isMagicNumber(14));
  }
);

