import * as services from '@/services/category';
import { ModelType, ModelState } from '@/models';
import { Modal } from 'antd';
export interface ICategory {
  _id?: string;
  name: string;
  icon: string;
}

export interface CategoryState extends ModelState {
  list?: ICategory[];
}
const initialState: CategoryState = {
  list: [],
};
const Model: ModelType<CategoryState> = {
  namespace: 'interview_category',
  state: initialState,
  reducers: {
    setList(state: CategoryState = initialState, { payload }) {
      state.list = payload;
      return { ...state };
    },
    deleteItem(state: CategoryState = initialState, { payload }) {
      state.list = state.list!.filter(item => item._id !== payload);
      return { ...state };
    },
    prependItem(state: CategoryState = initialState, { payload }) {
      state.list?.unshift(payload);
      return { ...state };
    },
    modifyItem(state: CategoryState = initialState, { payload }) {
      const targetIndex = state.list!.findIndex(item => item.id === payload.id);
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
