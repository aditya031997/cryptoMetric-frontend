import { Decimal } from 'decimal.js';

module.exports = function formatPercent(options) {
  const value = options.fn(this);
  const numValue = parseFloat(value);
  let fixedValue = Decimal(numValue).toFixed(3);
  if (fixedValue.includes('.')) {
    fixedValue = fixedValue.replace(/\.?0+$/, '');
  }
  return `${numValue > 0 ? '+' : ''}${fixedValue}%`;
};
