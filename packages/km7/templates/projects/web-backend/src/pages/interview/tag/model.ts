import * as services from '@/services/tag';
import { ModelType, ModelState } from '@/models';
import { Modal } from 'antd';
import { ICategory } from '../category/model';
export interface ITag {
  _id?: string;
  name: string;
  icon: string;
  category: ICategory;
}

export interface TagState extends ModelState {
  list?: ITag[];
}
const initialState: TagState = {
  list: [],
};
const Model: ModelType<TagState> = {
  namespace: 'interview_tag',
  state: initialState,
  reducers: {
    setList(state: TagState = initialState, { payload }) {
      state.list = payload;
      return { ...state };
    },
    deleteItem(state: TagState = initialState, { payload }) {
      state.list = state.list!.filter(item => item._id !== payload);
      return { ...state };
    },
    prependItem(state: TagState = initialState, { payload }) {
      state.list?.unshift(payload);
      return { ...state };
    },
    modifyItem(state: TagState = initialState, { payload }) {
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
