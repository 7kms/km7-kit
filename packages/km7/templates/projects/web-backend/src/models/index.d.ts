import { Reducer, AnyAction } from 'redux';
import { Effect, Subscription, EffectsCommandMap, Model } from 'dva';
import { SubscriptionAPI } from 'dva';
import { RouterTypes } from 'umi';

type customEffect = (action: customAction, effects: EffectsCommandMap) => void;

interface customAction extends AnyAction {
  callback?: Function;
}

export interface ModelState {
  [prop: string]: any;
}

export interface ModelType<T extends ModelState> extends Model {
  namespace: string;
  state: T;
  reducers: {
    [prop: string]: Reducer<T, AnyAction>;
  };
  effects: {
    [prop: string]: customEffect;
  };
}

export type UmiPageProps = SubscriptionAPI & RouterTypes;
