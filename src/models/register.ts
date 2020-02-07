import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { fakeRegister } from '@/services/user';

export interface RegisterStateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: RegisterStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: RegisterStateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    registerHandle: Reducer<RegisterStateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndRegister',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
