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
