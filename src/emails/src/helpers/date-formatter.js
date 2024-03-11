const { format, parseISO } = require('date-fns');

module.exports = function (options) {
  const date = format(parseISO(options.fn(this)), 'dd MMM');
  return '<p class="m-0 text text--small text-nowrap text-secondary" style="text-align: left;">' + date + '<p/>';
};
