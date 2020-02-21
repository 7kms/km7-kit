import Request from '@/utils/api';

export const list = (params = {}) => {
  return Request.$get('/api/question/list', params);
};

export const detail = (id: string) => {
  return Request.$get(`/api/question/${id}`);
};

export const create = (params = {}) => {
  return Request.$post('/api/question', params);
};

export const update = (id: string, params = {}) => {
  return Request.$post(`/api/question/${id}`, params);
};

export const remove = (id: string, params = {}) => {
  return Request.$delete(`/api/question/${id}`, params);
};
