import { AllConfig } from './conf';
export default {
  API_TIMEOUT: 30000,
  APPID: '{{name}}',
  APPSECRET: '{{name}}-secret',
  OPAPPNAME: '{{name}}',
  api: {
    project: 'http://127.0.0.1:{{eggPort}}',
  },
} as AllConfig;
