const { test, assert } = require('..');

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// test(
//   './isMagicNumber',
//   ['./magicNumber', 14],
//   async (isMagicNumber, magicNumber) => {
//     // console.log(magicNumber);
//     await pause(500);
//     assert.ok(isMagicNumber(14));
//   }
// );
//
// test(
//   './isMagicNumber',
//   ['./magicNumber', 12],
//   async (isMagicNumber) => {
//     await pause(500);
//     assert.ok(isMagicNumber(12));
//     assert.ok(isMagicNumber(12));
//     // throw new Error('it threw!')
//   }
// );
//
// test(
//   './isMagicNumber',
//   async (isMagicNumber) => {
//     await pause(500);
//     assert.ok(isMagicNumber(42));
//     // assert.deepEqual({ foo: 1 }, { foo: 2 });
//     // assert.throws(() => {
//     //   throw new Error('hello');
//     // })
//   }
// );
