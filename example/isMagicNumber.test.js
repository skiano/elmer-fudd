const assert = require('assert');
const { test } = require('..');

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test(
  './isMagicNumber',
  ['./magicNumber', 14],
  async (isMagicNumber, mocks) => {
    console.log(mocks['./magicNumber']);
    await pause(500);
    assert.ok(isMagicNumber(14));
  }
);

test(
  './isMagicNumber',
  ['./magicNumber', 12],
  async (isMagicNumber) => {
    await pause(500);
    assert.ok(isMagicNumber(12));
  }
);

test(
  './isMagicNumber',
  async (isMagicNumber) => {
    await pause(500);
    assert.ok(isMagicNumber(42));
  }
);
