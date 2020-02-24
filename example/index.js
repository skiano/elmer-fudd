const path = require('path');
const { locate, run, report } = require('..');

async function main() {
  await run({
    ext: '.test.js',
    root: path.join(__dirname, 'tests'),
    alias: {
      '@src': path.join(__dirname, 'src'),
    },
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
})
