const serialize = (obj, prefix) => {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p;
      var v;
      if (p === 'filters') {
        v = obj[p] === null ? '' : obj[p];
      } else {
        v = obj[p];
      }
      str.push(v !== null && typeof v === 'object' ? serialize(v, k) : k + '=' + v);
    }
  }
  return str.join('&');
};

export { serialize };
