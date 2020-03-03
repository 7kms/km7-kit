import * as services from '@/services/admin';
import { ModelType, ModelState } from '@/models';
import { Modal } from 'antd';

export interface IUser {
  _id?: string;
  email: string;
}

export interface UserState extends ModelState {
  list?: IUser[];
}
const initialState: UserState = {
  list: [],
};
const Model: ModelType<UserState> = {
  namespace: 'admin_user',
  state: initialState,
  reducers: {
    setList(state: UserState = initialState, { payload }) {
      state.list = payload;
      return { ...state };
    },
    deleteItem(state: UserState = initialState, { payload }) {
      state.list = state.list!.filter(item => item._id !== payload);
      return { ...state };
    },
    prependItem(state: UserState = initialState, { payload }) {
      state.list?.unshift(payload);
      return { ...state };
    },
    modifyItem(state: UserState = initialState, { payload }) {
      const targetIndex = state.list!.findIndex(item => item._id === payload.id);
      if (~targetIndex) {
        state.list![targetIndex] = payload;
      }
      return { ...state };
    },
  },
  effects: {
    *getList({ params = {}, callback }, { call, put }) {
      const res = yield call(services.list, params);
      if (callback) {
        callback(res.list);
      } else {
        yield put({
          type: 'setList',
          payload: res.list,
        });
      }
    },
    *create({ params = {}, callback }, { call, put, select }) {
      const res = yield call(services.create, params);
      if (callback) {
        callback(res);
      } else {
        yield put({
          type: 'prependItem',
          payload: res,
        });
      }
    },
    *remove({ params, callback }, { call, put }) {
      const res = yield call(services.remove, params._id);
      if (res.ok) {
        callback && callback(res);
      } else {
        Modal.error({
          title: 'error',
          content: res.msg,
        });
      }
    },
    *update({ params = {}, callback }, { call, put }) {
      const { _id, ...rest } = params;
      const res = yield call(services.update, params._id, rest);
      if (callback) {
        callback(res);
      } else {
        yield put({
          type: 'modifyItem',
          payload: params,
        });
      }
    },
  },
};

export default Model;
