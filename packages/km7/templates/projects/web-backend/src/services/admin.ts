import Request from '@/utils/api';

export const list = (params = {}) => {
  return Request.$get('/api/admin/list', params);
};

export const create = (params = {}) => {
  return Request.$post('/api/admin', params);
};

export const update = (id: string, params = {}) => {
  return Request.$post(`/api/admin/${id}`, params);
};

export const remove = (id: string, params = {}) => {
  return Request.$delete(`/api/admin/${id}`, params);
};
