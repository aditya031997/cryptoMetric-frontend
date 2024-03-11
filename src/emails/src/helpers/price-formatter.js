import { Decimal } from 'decimal.js';

module.exports = function formatPrice(options) {
  const value = options.fn(this)
  let symbol = '$';
  let preFixedValue = value;
  if (typeof value === 'string' && Number.isNaN(parseInt(value[0]))) {
    symbol = value[0];
    preFixedValue = value.substring(1);
  }
  const numValue = parseFloat(preFixedValue);
  let fixedValue = Decimal(numValue)
    .toFixed(12)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');

  if (fixedValue.includes('.')) {
    fixedValue = fixedValue.replace(/\.?0+$/, '');
  }

  return `${symbol}${fixedValue}`;
};
