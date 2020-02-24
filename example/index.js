const path = require('path');
const { locate, run, report } = require('..');

async function main() {
  // require('./magicNumber.test');
  // require('./tests/isMagicNumber.test');

  

  const tests = await locate({
    root: path.join(__dirname, 'tests'),
    ext: '.test.js',
  });

  tests.forEach(require);

  const results = await run({
    home: __dirname,
    // aliases
    // tests

    // nyc?
  });

  report(results);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
