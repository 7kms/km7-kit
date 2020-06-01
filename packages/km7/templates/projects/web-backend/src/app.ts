import NDAppKit from '@ndog/webapp-kit';
import { plugin } from 'umi';
import onError from '@/plugins/onError';

export const render = (olderRender: Function) => {
  olderRender();
};


plugin.register({
  apply: {
    dva: {
      config: {
        onError: onError.onError,
      },
    },
  },
  path: 'Dva-onError:',
});
