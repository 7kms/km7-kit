export const dateFormat = (date: Date | string | number, mask: string) => {
  var d = typeof date !== 'object' ? new Date(date) : date;
  var zeroize = function(value: any, length?: number) {
    if (!length) {
      length = 2;
    }
    value = String(value);
    for (var i = 0, zeros = ''; i < length - value.length; i++) {
      zeros += '0';
    }
    return zeros + value;
  };
  return mask.replace(
    /"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g,
    function($0: any) {
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
          if (m > 99) {
            m = Math.round(m / 10);
          }
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

export const qs = (search: string) => {
  search = decodeURIComponent(search);
  let obj = {};
  if (search) {
    let str = '';
    if (search.indexOf('?') == 0) {
      str = search.slice(1);
    }
    let paramsArr = str.split('&');
    paramsArr.forEach(item => {
      let arr = item.split('=');
      let key = arr[0],
        value = arr[1];
      if (obj[key]) {
        obj[key] = Array.prototype.concat.call(obj[key], value);
      } else {
        obj[key] = value;
      }
    });
  }
  return obj;
};

export const UTCTimestamp = (str?: string) => {
  let date = str ? new Date(str) : new Date();
  return date.getTime() + date.getTimezoneOffset() * 60000;
};

export const getPlatform = () => {
  const ua = navigator.userAgent;
  let platform = '';
  if (ua.match('DingTalk')) {
    if (ua.match('AliApp')) {
      platform = 'DingTalk';
    } else {
      platform = 'DingTalk_Desktop';
    }
  } else {
    if ('ontouchstart' in window) {
      platform = 'Phone';
    } else {
      platform = 'Desktop';
    }
  }
  return platform;
};

export const mapQueryStrToObj = (str?: string) => {
  if (!str) {
    return {};
  }
  str = str.replace('?', '');
  let arr = str.split('&');
  let obj = {};
  arr.forEach((item: string) => {
    let key = item.split('=')[0];
    let value = item.split('=')[1];
    obj[key] = value;
  });
  return obj;
};
/**
 * @description 获取数据的具体类型
 * @param {any} o - 要判断的数据
 * @returns {string} - 返回该数据的具体类型
 */
export const getDataType = o => {
  // 映射数据类型
  const map2DataType = {
    '[object String]': 'String',
    '[object Number]': 'Number',
    '[object Undefined]': 'Undefined',
    '[object Boolean]': 'Boolean',
    '[object Array]': 'Array',
    '[object Function]': 'Function',
    '[object Object]': 'Object',
    '[object Symbol]': 'Symbol',
    '[object Set]': 'Set',
    '[object Map]': 'Map',
    '[object WeakSet]': 'WeakSet',
    '[object WeakMap]': 'WeakMap',
    '[object Null]': 'Null',
    '[object Promise]': 'Promise',
    '[object NodeList]': 'NodeList',
    '[object Date]': 'Date',
    '[object FormData]': 'FormData',
  };
  o = Object.prototype.toString.call(o);
  if (map2DataType[o]) {
    return map2DataType[o];
  } else {
    return o.replace(/^\[object\s(.*)\]$/, '$1');
  }
};

/**
 * @description 根据路径获取对象的值（也可用插件@babel/plugin-proposal-optional-chaining）
 * @param {object} obj - 对象
 * @param {string} keypath - 路径
 * @param {any} defaultValue - 默认值
 */
export const getValue = (obj: object, keypath: string, defaultValue?: string) => {
  if (!obj) {
    throw new Error('the first param obj is required');
  }
  if (!keypath) {
    throw new Error('the second param keypath is required');
  }
  if (getDataType(obj) !== 'Object') {
    throw new Error('the first param obj must be object');
  }
  if (getDataType(keypath) !== 'String') {
    throw new Error('the second param keypath must be string');
  }
  // return String.prototype.split.call(keypath, /[,[\].]+?/)
  //   .filter(Boolean)
  //   .reduce((a, c) => (Object.hasOwnProperty.call(a,c) ? a[c] : defaultValue), obj)

  const arr = keypath.replace(/\[(\d+)\]/g, '.$1').split('.');
  for (const key of arr) {
    obj = Object(obj)[key];
    if (obj === undefined) {
      return defaultValue;
    }
  }
  return obj;
};

/**
 *
 * @param {(string|object)} json - json字符串/对象
 * @param {number['\t']} space - 缩进, 默认是一个tab
 */
export const syntaxHighlight = (json: object | string, space: number | string = '\t') => {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, space);
  }
  json = json
    .replace(/(\\r|\\n)+/gi, '')
    .replace(/<style(.)*style>/g, '')
    .replace(/<[(!)|(\\)|(\-)|(,)|(;)|(\/)|(a-z)|(A-Z)|(1-6)|(8)|(\s)|(=)|(\")|(\n)|(\t)]+>/gi, '')
    .replace(/\s{10,}/g, '\r\t');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    },
  );
};
