import HmacSHA256 from 'crypto-js/hmac-sha256';
import CryptoJS from 'crypto-js';

export interface ISignObj {
  Signature: string;
  ts: number;
}
interface ICheckRes {
  check: boolean;
  msg: string;
}

/**
 * (1)将参数的key按照首字母升序排列，
 * (2)并把每一个key对应的value进行序列化(不能直接转为字符串,是防止某些接口的参数值是对象而被解析为[object,object])
 * (3)将得到的key,value对用&连接成字符串
 * (4)将APPID分别加在上面得到的字符串的头部
 * (5)获取当前的时间戳(毫秒)，作为ts的值放在尾部，得到一个最终的字符串
 * (6)对上面得到的字符串，用APPSECRET作为secret进行一次HmacSHA256加密,得到hash
 * (7)对hash转为base64格式，并进行encode,得到最后的Signature
 * (7)将Signature以及第5步得到的时间戳ts，拼接成Signature=xxxxxxxxxx&ts=yyyyyyy的形式作为最终的签名
 */

const generateSign = ({
  APPID = '',
  APPSECRET = '',
  paramsObj = {},
  ts,
}: {
  APPID: string;
  APPSECRET: string;
  paramsObj: IAnyObj;
  ts?: number;
}): string => {
  let sign = '';
  let paramsKey: string[] = Object.keys(paramsObj);
  let tmpSignStr = '';
  paramsKey = paramsKey.sort();
  for (let i = 0; i < paramsKey.length; i++) {
    const key: string = paramsKey[i];
    const value: string | number | boolean =
      typeof paramsObj[key] === 'object' ? JSON.stringify(paramsObj[key]) : paramsObj[key];
    tmpSignStr += `&${key}${value}`;
  }
  ts = ts || new Date().getTime();
  tmpSignStr = `APPID${APPID}${tmpSignStr}&ts${ts}`;
  const hash = HmacSHA256(tmpSignStr, APPSECRET);
  const Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
  sign = `Signature=${Signature}&ts=${ts}`;
  // console.log('generateSign:::', APPID, APPSECRET, paramsObj, sign)
  return sign;
};

const parseSign = ({ sign }: { sign: string }): ISignObj => {
  const obj: IAnyObj = {};
  const arr = sign.split('&');
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i].split('=')[0];
    const value = arr[i].split('=')[1];
    obj[key] = value;
  }
  const Signature = obj.Signature || '';
  const ts = Number(obj.ts) || 0;
  return {
    Signature,
    ts,
  };
};

class Sign {
  addSign = ({
    APPID = '',
    APPSECRET = '',
    paramsObj = {},
  }: {
    APPID: string;
    APPSECRET: string;
    paramsObj?: IAnyObj;
  }): string => {
    const sign = generateSign({ APPID, APPSECRET, paramsObj });
    // console.log('add:::', sign)
    return sign;
  };

  checkSign = ({
    APPID,
    APPSECRET,
    paramsObj,
    sign,
  }: {
    APPID: string;
    APPSECRET: string;
    paramsObj: IAnyObj;
    sign: string;
  }): ICheckRes => {
    const now = new Date().getTime();
    const { ts } = parseSign({ sign });
    if (now - ts > 2 * 60 * 1000) {
      return {
        check: false,
        msg: 'Signature Expired',
      };
    }
    const targetSign = generateSign({ APPID, APPSECRET, paramsObj, ts });
    // console.log('check:::', targetSign)
    if (sign === targetSign) {
      return {
        check: true,
        msg: 'Signature Check Passed',
      };
    }
    return {
      check: false,
      msg: 'Signature Check Failed',
    };
  };
}
export default Sign;
