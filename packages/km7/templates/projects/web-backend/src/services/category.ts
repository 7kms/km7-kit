import Request from '@/utils/api';

export const list = (params = {}) => {
  return Request.$get('/api/category/list', params);
};

export const create = (params = {}) => {
  return Request.$post('/api/category', params);
};

export const update = (id: string, params = {}) => {
  return Request.$post(`/api/category/${id}`, params);
};

export const remove = (id: string, params = {}) => {
  return Request.$delete(`/api/category/${id}`, params);
};
