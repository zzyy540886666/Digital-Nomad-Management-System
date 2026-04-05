import request from '@/utils/request'

export const getList = (params) => request.get('/admin/pois', { params })
export const getDetail = (id) => request.get(`/admin/pois/${id}`)
export const create = (data) => request.post('/admin/pois', data)
export const update = (id, data) => request.put(`/admin/pois/${id}`, data)
export const remove = (id) => request.delete(`/admin/pois/${id}`)
