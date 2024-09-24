import { atom } from 'recoil';
import { sessionStorageEffect } from '../utils/sessionStorageEffect';

let loginState = atom({
  key: 'loginInfo',
  default: {},
  effects: [sessionStorageEffect('login_info')],
});

export const token = atom({
  key: 'token',
  default: '',
  effects: [sessionStorageEffect('token')],
});

export default loginState;
