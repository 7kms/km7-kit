const Mongoose = require('mongoose');
exports.ObjectId = Mongoose.Types.ObjectId;

exports.autobind = (self, options) => {
  options = Object.assign({}, options);
  const filter = key => {
    const match = pattern => (typeof pattern === 'string' ? key === pattern : pattern.test(key));
    if (options.include) {
      return options.include.some(match);
    }
    if (options.exclude) {
      return !options.exclude.some(match);
    }
    return true;
  };
  for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(self))) {
    const val = self[key];
    if (key !== 'constructor' && typeof val === 'function' && filter(key)) {
      self[key] = val.bind(self);
    }
  }
  return self;
};

const dateFormat = (date, mask) => {
  var d = typeof date !== 'object' ? new Date(date) : date;
  var zeroize = function(value, length) {
    if (!length) length = 2;
    value = String(value);
    for (var i = 0, zeros = ''; i < length - value.length; i++) {
      zeros += '0';
    }
    return zeros + value;
  };
  return mask.replace(
    /"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g,
    function($0) {
      switch ($0) {
        case 'd':
          return d.getDate();
        case 'dd':
          return zeroize(d.getDate());
        case 'ddd':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
        case 'dddd':
          return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
            d.getDay()
          ];
        case 'M':
          return d.getMonth() + 1;
        case 'MM':
          return zeroize(d.getMonth() + 1);
        case 'MMM':
          return [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ][d.getMonth()];
        case 'MMMM':
          return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][d.getMonth()];
        case 'yy':
          return String(d.getFullYear()).substr(2);
        case 'yyyy':
          return d.getFullYear();
        case 'h':
          return d.getHours() % 12 || 12;
        case 'hh':
          return zeroize(d.getHours() % 12 || 12);
        case 'H':
          return d.getHours();
        case 'HH':
          return zeroize(d.getHours());
        case 'm':
          return d.getMinutes();
        case 'mm':
          return zeroize(d.getMinutes());
        case 's':
          return d.getSeconds();
        case 'ss':
          return zeroize(d.getSeconds());
        case 'l':
          return zeroize(d.getMilliseconds(), 3);
        case 'L':
          var m = d.getMilliseconds();
          if (m > 99) m = Math.round(m / 10);
          return zeroize(m);
        case 'tt':
          return d.getHours() < 12 ? 'am' : 'pm';
        case 'TT':
          return d.getHours() < 12 ? 'AM' : 'PM';
        case 'Z':
          return d.toUTCString().match(/[A-Z]+$/);
        // Return quoted strings with the surrounding quotes removed
        default:
          return $0.substr(1, $0.length - 2);
      }
    },
  );
};

const UTCTimestamp = str => {
  let date = str ? new Date(str) : new Date();
  return date.getTime() + date.getTimezoneOffset() * 60000;
};

exports.UTC2IST = (str, pattern) => {
  if (str) {
    pattern = pattern || 'yyyy-MM-dd HH:mm:ss';
    let utcTimestamp = UTCTimestamp(str);
    str = dateFormat(utcTimestamp + 330 * 60 * 1000, pattern);
  }
  return str;
};
exports.IST2UTC = (str, pattern) => {
  if (str) {
    pattern = pattern || 'yyyy-MM-dd HH:mm:ss';
    let istTimestamp = new Date(str).getTime();
    str = dateFormat(istTimestamp - 330 * 60 * 1000, pattern);
  }
  return str;
};

exports.toPercent = (value, num) => {
  if (String(value) === 'undefined') return '--';
  return (value * 100).toFixed(num) + '%';
};
