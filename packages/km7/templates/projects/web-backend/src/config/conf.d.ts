export interface ApIObj {
  project: string; //当前项目服务端对应的url
  session: string; //请求公共session(如:profile和permission接口)对应的url
  sso: string; //登录界面的url
}
export interface AllConfig {
  OPAPPNAME: string;
  API_TIMEOUT?: number;
  APPID: string;
  APPSECRET: string;
  api: ApIObj;
}
