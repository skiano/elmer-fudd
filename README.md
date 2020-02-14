# elmer-fudd

_Hunt for Bugs!_

### What is it?

A test runner for smallish node projects with an opinionated take on mocking (and _very_ few dependencies).

### Dependencies

|Package|Why|
|:------|:--|
|`pirates`| for patching require |
|`stack-trace`| for identifying call sites |

### Examples

```javascript
const { test, name, assert } = require('elmer-fudd');


// Minimal test
test(() => { assert.ok(true); });

// Testing a unit without mocking
test('@src/lib/unit', (unit) => {
  assert.ok(unit);
});

// Testing a unit with mocking
test(
  '@src/lib/unit',
  ['@src/lib/dep', { fake: true }],
  (unit, dep) => {
    assert.ok(unit);
    assert.ok(dep.fake);
  }
);

// Giving tests a name
test(
  '@src/lib/unit',
  ['@src/lib/mocked', { fake: true }],
  (unit, mocked) => {
    name('My test name...'); // <-- add a name
    assert.ok(unit);
    assert.ok(mocked.fake);
  }
);
```
