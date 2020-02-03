const { run } = require('..');

async function main() {
  require('./magicNumber.test');
  require('./isMagicNumber.test');
  const results = await run({
    home: __dirname,
  });
  console.log(JSON.stringify(results, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
