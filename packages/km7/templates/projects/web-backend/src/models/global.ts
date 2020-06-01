import { Effect, Subscription, Model } from 'dva';
import { Reducer } from 'redux';
import { getProfile, login, logout, resetPwd } from '../services/global';
import AppConfig from '../config/index';
import { message } from 'antd';
import { useHistory } from 'umi';
import totalmenu, { IAppMenu } from '@/data/menu';
export interface IUser {
  username: string;
  email: string;
  [s: string]: any;
}

export interface GlobalModelState {
  user: IUser | null;
  totalPermission: IAppMenu[];
}

export interface GlobalModelType extends Model {
  reducers: {
    changeAppInfo: Reducer<GlobalModelState>;
  };
}

const initialState: GlobalModelState = {
  user: null,
  totalPermission: totalmenu,
};

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: initialState,
  reducers: {
    changeAppInfo(state: GlobalModelState = initialState, { payload }) {
      state.user = payload.user;
      return state;
    },
  },
  effects: {
    *getProfile(_, { call, select, put }) {
      try {
        const res = yield call(getProfile);
        yield put({
          type: 'changeAppInfo',
          payload: {
            user: res,
          },
        });
      } catch (e) {
        console.log(e);
        window.location.href = `${AppConfig.api.project}/login`;
      }
    },
    *login({ params }, { call, select, put }) {
      const res = yield call(login, params);
      if (res && res.ok) {
        message.success('登录成功');
        yield put({
          type: 'changeAppInfo',
          payload: {
            user: res.data,
          },
        });
        useHistory().replace({ pathname: '/' });
      } else {
        message.error(res.msg);
      }
    },
    *logout(_, { call, select, put }) {
      const res = yield call(logout);
      if (res.ok) {
        window.location.href = `${AppConfig.api.project}/login`;
      } else {
        message.error('退出失败');
      }
    },
    *resetPwd({ params, callback }, { call }) {
      try {
        yield call(resetPwd, params);
        message.success(`The new password is ${params.pwd}`);
        if (callback) {
          callback();
        }
      } catch (e) {
        console.log(e);
        message.error('reset failed!');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      const {
        location: { pathname },
      } = history;
      // 如果不是登录页面，则需求请求用户信息
      if (pathname !== '/login') {
        dispatch({ type: 'getProfile' });
      }
    },
  },
};

export default GlobalModel;
