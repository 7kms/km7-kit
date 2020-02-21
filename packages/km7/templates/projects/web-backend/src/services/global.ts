import Request from '@/utils/api';
import { IUser } from '@/models/global';
export const getProfile = (params = {}) => {
  return Request.$get<IUser>('/api/admin/getProfile', params);
};

export const login = (params = {}) => {
  return Request.$post('/api/admin/login', params);
};

export const logout = (params = {}) => {
  return Request.$post('/api/admin/logout', params);
};

export const resetPwd = (params = {}) => {
  return Request.$post('/api/admin/resetPwd', params);
};
