import { AnyAction, Dispatch } from 'redux';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { CategoryState } from '../pages/interview/category/model';

export interface Loading {
  global: boolean;
  effects: {
    [key: string]: boolean | undefined;
  };
  models: {
    global?: boolean;
  };
}
export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  interview_category: CategoryState;
}

export interface Route {
  routes?: Route[];
}

export interface ConnectProps<T = {}> {
  dispatch: Dispatch<AnyAction>;
}
