const path = require('path');
const { locate, run, report } = require('..');

async function main() {
  // require('./magicNumber.test');
  // require('./tests/isMagicNumber.test');

  // const results = await run({
  //   home: __dirname,
  //   // aliases
  //   // tests

  //   // nyc?
  // });

  const tests = await locate({
    root: path.join(__dirname, 'tests'),
    ext: '.test.js',
  });
  
  console.log(tests);
  // report(results);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
