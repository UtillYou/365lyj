import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';

import {  getCaptcha } from '@/services/user';
import { setAuthority,getToken,setToken, setMenus } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  token?:string;
  userName?:string;
  menus?:any;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    token: getToken(),
    userName:undefined,
    menus:undefined,
  },

  effects: {
    *getCaptcha({ payload }, { call }) {
      yield call(getCaptcha, payload);
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: undefined,
          token: undefined,
          userName:undefined,
          menus:undefined,
        },
      });
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setToken(payload.token);
      setAuthority('admin');
      setMenus(payload.menus);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        token:payload.token,
        userName:payload.userName,
        menus:payload.menus,
      };
    },
  },
};

export default Model;
