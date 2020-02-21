import * as services from '@/services/question';
import { ModelType, ModelState } from '@/models';
import { Modal } from 'antd';
import { ICategory } from '../category/model';
import { ITag } from '../tag/model';

export interface IQuestion {
  _id?: string;
  title: string;
  keywords: string[];
  description: string;
  content: string;
  category: ICategory;
  tags: ITag[];
  author: any;
  viewCount: number;
  level: number;
  [p: string]: any;
}

export interface QuestionState extends ModelState {
  list?: IQuestion[];
}
const initialState: QuestionState = {
  list: [],
};
const Model: ModelType<QuestionState> = {
  namespace: 'interview_question',
  state: initialState,
  reducers: {
    setList(state: QuestionState = initialState, { payload }) {
      state.list = payload;
      return { ...state };
    },
    deleteItem(state: QuestionState = initialState, { payload }) {
      state.list = state.list!.filter(item => item._id !== payload);
      return { ...state };
    },
    prependItem(state: QuestionState = initialState, { payload }) {
      state.list?.unshift(payload);
      return { ...state };
    },
    modifyItem(state: QuestionState = initialState, { payload }) {
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
        callback(res);
      } else {
        yield put({
          type: 'setList',
          payload: res.list,
        });
      }
    },
    *getById({ params = {}, callback }, { call, put }) {
      const res = yield call(services.detail, params.id);
      if (callback) {
        callback(res);
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
