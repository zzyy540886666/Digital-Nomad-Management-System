import request from '@/utils/request'

export const getList = (params) => request.get('/admin/events', { params })
export const getDetail = (id) => request.get(`/admin/events/${id}`)
export const create = (data) => request.post('/admin/events', data)
export const update = (id, data) => request.put(`/admin/events/${id}`, data)
export const remove = (id) => request.delete(`/admin/events/${id}`)
export const getSignups = (id) => request.get(`/admin/events/${id}/signups`)
export const exportSignups = (id) => request.get(`/admin/events/${id}/signups/export`, { responseType: 'blob' })
