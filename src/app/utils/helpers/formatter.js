import { Decimal } from 'decimal.js';

const decimalFormatter = {
  getUpTo1Dollar: (value) =>
    Decimal(value)
      .toFixed(12)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,'),
  get1To100Dollar: (value) =>
    Decimal(value)
      .toFixed(4)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,'),
  getMoreThan100Dollar: (value) =>
    Decimal(value)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,'),
};

const getPriceByQuantity = (price) => {
  if (price >= 1 && price <= 100) {
    return decimalFormatter.get1To100Dollar(price);
  }
  if (price > 100) {
    return decimalFormatter.getMoreThan100Dollar(price);
  }
  return decimalFormatter.getUpTo1Dollar(price);
};

function simpleFormatPrice(value, currency = '$', currencyPosition = true) {
  let isStr = false;
  let symbol = currency;
  let preFixedValue = value;
  if (typeof value === 'string') {
    isStr = true;
    if (Number.isNaN(parseInt(value[0]))) {
      symbol = value[0];
      preFixedValue = value.substring(1);
    } else {
      preFixedValue = value;
    }
  }

  let numValue = null;
  let numStr = null;
  if (!isStr) {
    numValue = parseFloat(preFixedValue);
    numStr = `${numValue}`;
  } else {
    numValue = parseFloat(preFixedValue);
    numStr = preFixedValue;
  }

  if (numStr.includes('e')) {
    let strParts = numStr.split('e');
    numStr = numValue.toFixed(strParts[0].length + Math.abs(parseInt(strParts[1])));
  }
  if (!numStr.includes('.')) {
    numStr += '.0';
  }
  let fixedValue = numStr.replace(/\d(?=(\d{3})+\.)/g, '$&,');
  if (fixedValue.includes('.')) {
    fixedValue = fixedValue.replace(/\.?0+$/, '');
  }
  if (currencyPosition) {
    return `${symbol}${fixedValue}`;
  }
  return `${fixedValue}${symbol}`;
}

function formatPrice(value, currency = '$', currencyPosition = true) {
  let symbol = currency;
  let preFixedValue = value;
  if (typeof value === 'string' && Number.isNaN(parseInt(value[0]))) {
    symbol = value[0];
    preFixedValue = value.substring(1);
  }
  const numValue = parseFloat(preFixedValue);
  let fixedValue = getPriceByQuantity(numValue);

  if (fixedValue.includes('.')) {
    fixedValue = fixedValue.replace(/\.?0+$/, '');
  }
  if (currencyPosition) {
    return `${symbol}${fixedValue}`;
  }
  return `${fixedValue}${symbol}`;
}

function formatPercent(value) {
  const numValue = parseFloat(value);
  let fixedValue = Decimal(numValue).toFixed(3);
  if (fixedValue.includes('.')) {
    fixedValue = fixedValue.replace(/\.?0+$/, '');
  }
  return `${numValue > 0 ? '+' : ''}${fixedValue}%`;
}

function simpleFormatPercent(value) {
  const numValue = parseFloat(value);
  let fixedValue = Decimal(numValue).toFixed();
  if (fixedValue.includes('.')) {
    fixedValue = fixedValue.replace(/\.?0+$/, '');
  }
  return `${numValue > 0 ? '+' : ''}${fixedValue}%`;
}

export { formatPrice, formatPercent, simpleFormatPrice, simpleFormatPercent };
