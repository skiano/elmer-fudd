const { run, report } = require('..');

async function main() {
  require('./magicNumber.test');
  require('./isMagicNumber.test');

  const results = await run({
    home: __dirname,
  });

  report(results);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
