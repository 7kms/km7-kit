import axios, { CancelToken, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
// import Sign from './apiSign'

export type ReqConfig = {
  serverAPI?: string;
  API_TIMEOUT?: number;
};

export enum SideType {
  Client = 'Client',
  Server = 'Server',
}

export const isClient = () => {
  return typeof window !== 'undefined';
};

enum HttpReqType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

const generateUrl = (url: string, sign?: string): string => {
  // const queryString = url.indexOf('?') === -1 ? '?' + sign : '&' + sign
  // url += queryString
  return url;
};

const headerConfig = (): { headers: object; [s: string]: any } => {
  const obj = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
  return obj;
};

class KM7Request {
  readonly side: SideType;
  private cookies = '';
  private baseObj: object;
  constructor(params?: ReqConfig) {
    this.baseObj = {
      timeout: params?.API_TIMEOUT || 60000,
      responseType: 'json',
      baseURL: params?.serverAPI,
    };
    if (isClient()) {
      this.side = SideType.Client;
    } else {
      this.side = SideType.Server;
    }
  }
  private errorProcess = <T>(error: AxiosError): Promise<T> => {
    console.log(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      if (this.side === SideType.Server) {
        const errorRes = {
          status: error.response.status,
          statusText: error.response.statusText,
          data: { API_Error: error.response.data },
          config: error.response.config,
        };
        return Promise.reject(errorRes);
      } else {
        return Promise.reject(error.response.data);
      }
    } else if (error.message) {
      return Promise.reject(error.message);
    } else {
      return Promise.reject(error);
    }
  };
  private successProcess = <T>(response: AxiosResponse): Promise<T> => {
    if (this.side === SideType.Client) {
      return Promise.resolve(response.data.result);
    }
    return Promise.resolve(response.data);
  };
  private $apiProcess = <T>(httpConfig: AxiosRequestConfig): Promise<T | any> => {
    return axios(httpConfig)
      .then((res: AxiosResponse) => {
        return this.successProcess<T>(res);
      })
      .catch(this.errorProcess);
  };
  private generateRequestObj = (
    method: HttpReqType,
    url: string,
    paramsObj: IAnyObj,
    cancelToken?: CancelToken,
  ): AxiosRequestConfig => {
    for (const key in paramsObj) {
      if (paramsObj[key] === undefined || paramsObj[key] === null) {
        delete paramsObj[key];
      }
    }
    const obj = {
      method: method,
      url: generateUrl(url),
      cancelToken,
    } as IAnyObj;
    if (method === HttpReqType.GET) {
      obj.params = paramsObj;
    } else {
      obj.data = paramsObj;
    }
    return Object.assign({}, this.baseObj, obj, headerConfig());
  };

  setInitialCookies = (cookies: string): void => {
    this.cookies = cookies;
  };

  $request = <T>(
    url: string,
    method: HttpReqType,
    paramsObj: IAnyObj = {},
    customHeader: IAnyObj = {},
    cancelToken?: CancelToken,
  ): Promise<T> => {
    const configObj = this.generateRequestObj(method, url, paramsObj, cancelToken);
    Object.assign(configObj.headers, customHeader);
    return this.$apiProcess<T>(configObj);
  };

  $get = async <T>(url: string, paramsObj: IAnyObj = {}, cancelToken?: CancelToken): Promise<T> => {
    const configObj = this.generateRequestObj(HttpReqType.GET, url, paramsObj, cancelToken);
    return this.$apiProcess<T>(configObj);
  };

  $getwithCustomCookie = <T>(
    url: string,
    paramsObj: IAnyObj = {},
    cookie: string = this.cookies,
  ): Promise<T> => {
    const configObj = this.generateRequestObj(HttpReqType.GET, url, paramsObj);
    configObj.headers.Cookie = cookie;
    configObj.withCredentials = true;
    return this.$apiProcess<T>(configObj);
  };

  $post = async <T>(
    url: string,
    paramsObj: IAnyObj = {},
    cancelToken?: CancelToken,
  ): Promise<T> => {
    const configObj = this.generateRequestObj(HttpReqType.POST, url, paramsObj, cancelToken);
    return this.$apiProcess<T>(configObj);
  };

  $postwithCustomCookie = <T>(
    url: string,
    paramsObj: IAnyObj = {},
    cookie: string = this.cookies,
  ): Promise<T> => {
    const configObj = this.generateRequestObj(HttpReqType.POST, url, paramsObj);
    configObj.headers.Cookie = cookie;
    configObj.withCredentials = true;
    return this.$apiProcess<T>(configObj);
  };

  $put = async <T>(url: string, paramsObj: IAnyObj = {}, cancelToken?: CancelToken): Promise<T> => {
    const configObj = this.generateRequestObj(HttpReqType.PUT, url, paramsObj, cancelToken);
    return this.$apiProcess<T>(configObj);
  };

  $delete = async <T>(
    url: string,
    paramsObj: IAnyObj = {},
    cancelToken?: CancelToken,
  ): Promise<T> => {
    const configObj = this.generateRequestObj(HttpReqType.DELETE, url, paramsObj, cancelToken);
    return this.$apiProcess<T>(configObj);
  };

  $download = (url: string, paramsObj: IAnyObj = {}): void => {
    url = `${url}?params=${escape(JSON.stringify(paramsObj))}`;
    window.open(url);
  };

  // client使用
  $upload = <T>(url: string, { name, file }: { name: string; file: File }): Promise<T> => {
    const formdata = new FormData();
    formdata.append(name, file);
    const configObj = Object.assign({}, this.baseObj, {
      method: HttpReqType.POST,
      headers: { 'Content-Type': 'multipart/form-data' },
      url: generateUrl(url),
      data: formdata,
      withCredentials: true,
    });
    return this.$apiProcess<T>(configObj);
  };
}

export default new KM7Request();
