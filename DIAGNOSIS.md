## CI Failures Diagnosis

This document records the observed CI/test failures from running the project's pipeline locally. Each entry lists: the failing step, the exact log lines observed, and an explanation of the root cause.

1) Step: Run tests — `src/payments/calculateDiscount.test.js`

   Error (excerpt):

   "FAIL  src/payments/calculateDiscount.test.js (10.826 s)"
   "● applies 10 percent discount correctly"

   "expect(received).toBe(expected) // Object.is equality"

   "Expected: 100"
   "Received: 90"

   Location: src/payments/calculateDiscount.test.js:8:38

   Explanation: The test expected `100` while the function `calculateDiscount(100, 10)` correctly returns `90`. The assertion in the test is wrong — it expected the original price instead of the discounted price.

2) Step: Run tests — `src/utils/formatCurrency.test.js`

   Error (excerpt):

   "FAIL  src/utils/formatCurrency.test.js (10.828 s)"
   "● formats currency correctly"

   "expect(received).toBe(expected) // Object.is equality"

   "If it should pass with deep equality, replace \"toBe\" with \"toStrictEqual\""

   "Expected: {\"amount\": 10.01, \"currency\": \"USD\"}"
   "Received: serializes to the same string"

   Location: src/utils/formatCurrency.test.js:5:41

   Explanation: The test used `toBe` for comparing objects which checks identity. The matcher should be `toEqual` (or `toStrictEqual`) for deep equality. The function returns the correct object but the test failed because of the wrong matcher.

3) Step: Install dependencies — `npm ci` / `npm install`

   Errors (observed while reproducing locally):

   - Before installing: when running tests without installing devDependencies the run failed with:
     "'jest' is not recognized as an internal or external command, operable program or batch file."

   - Running `npm ci` initially produced npm usage/error output (example excerpt):
     "npm error"
     "npm error Options:"
     "npm error Run \"npm help ci\" for more info"

   - After running `npm install` locally the `package-lock.json` was updated (lockfile was out of sync with `package.json`).

   Explanation: CI relies on devDependencies (e.g., `jest`) being installed. A mismatch between `package.json` and `package-lock.json` caused `npm ci` to be unreliable locally. Updating the lockfile (by running `npm install`) and committing the revised `package-lock.json` makes installs reproducible. The workflow should use `npm ci` to ensure deterministic installs in CI.

Summary of fixes applied:

- Corrected the assertion in `src/payments/calculateDiscount.test.js` (expected 90 instead of 100).
- Replaced `toBe` with `toEqual` in `src/utils/formatCurrency.test.js`.
- Regenerated `package-lock.json` locally (via `npm install`) and committed the updated lockfile so `npm ci` works deterministically in CI.
