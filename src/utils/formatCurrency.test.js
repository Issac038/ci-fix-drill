const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // `toBe` checks object identity; use `toEqual` for deep equality comparison.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});
