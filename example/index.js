const assert = require('assert');
const { run } = require('..');

async function main() {
  require('./magicNumber.test');
  require('./isMagicNumber.test');
  const results = await run({
    home: __dirname,
  });
  console.log(results);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
