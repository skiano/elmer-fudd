const assert = require('assert');
const { test, run } = require('..');

async function main() {
  require('./isMagicNumber.test');
  const results = await run();
  console.log(results);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
