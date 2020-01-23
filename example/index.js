const assert = require('assert');
const { test, run } = require('..');

async function main() {
  const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const r1 = await test('should equal 14', {
    unit: './isMagicNumber',
    mock: {
      './magicNumber': 14,
    }
  }, async (isMagicNumber) => {
    console.log(require('./magicNumber'));
    await pause(500);
    console.log(require('./magicNumber'));
    assert.ok(isMagicNumber(14));
  });

  const r2 = await test('should equal 12', {
    unit: './isMagicNumber',
    mock: {
      './magicNumber': 12,
    }
  }, async (isMagicNumber) => {
    console.log(require('./magicNumber'));
    await pause(500);
    console.log(require('./magicNumber'));
    assert.ok(isMagicNumber(12));
  });

  const r3 = await test('should be real', {
    unit: './isMagicNumber',
  }, async (isMagicNumber) => {
    console.log(require('./magicNumber'));
    await pause(500);
    console.log(require('./magicNumber'));
    assert.ok(isMagicNumber(12));
  });

  const results = await run();
  console.log(results);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
