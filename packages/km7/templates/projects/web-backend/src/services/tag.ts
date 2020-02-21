import Request from '@/utils/api';

export const list = (params = {}) => {
  return Request.$get('/api/tag/list', params);
};

export const create = (params = {}) => {
  return Request.$post('/api/tag', params);
};

export const update = (id: string, params = {}) => {
  return Request.$post(`/api/tag/${id}`, params);
};

export const remove = (id: string, params = {}) => {
  return Request.$delete(`/api/tag/${id}`, params);
};
