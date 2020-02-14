const { test, name, assert } = require('..');

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test(
  './isMagicNumber',
  ['./magicNumber', 14],
  async (isMagicNumber, magicNumber) => {
    name('Test 1');
    // console.log(magicNumber);
    await pause(500);
    assert.ok(isMagicNumber(14));
  }
);

test(
  './isMagicNumber',
  ['./magicNumber', 12],
  async (isMagicNumber) => {
    name('Test 2');
    await pause(500);
    assert.ok(isMagicNumber(12));
    assert.ok(isMagicNumber(12));
  }
);

test(
  './isMagicNumber',
  async (isMagicNumber) => {
    name('Test 3');
    await pause(500);
    assert.ok(isMagicNumber(42));
  }
);
