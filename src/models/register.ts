import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { register,getCaptcha } from '@/services/user';

export interface RegisterStateType {
  status?: number;
  currentAuthority?: 'user' | 'guest' | 'admin';
  msg?:string;
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
    captcha:Effect;
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
      const response = yield call(register, payload);
      
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    *captcha({ payload }, { call }) {
       yield call(getCaptcha, payload.mobile);

    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        msg:payload.msg,
      };
    },
  },
};

export default Model;
