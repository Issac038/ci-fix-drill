const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  expect(calculateDiscount(100, 0)).toBe(100); // This passes
});

test('applies 10 percent discount correctly', () => {
  // The function correctly returns 90 for a 10% discount on 100.
  // The test previously expected 100 which is incorrect; fix to expect 90.
  expect(calculateDiscount(100, 10)).toBe(90);
});
