import request from '@/utils/request'

export const getList = (params) => request.get('/admin/tasks', { params })
export const getDetail = (id) => request.get(`/admin/tasks/${id}`)
export const create = (data) => request.post('/admin/tasks', data)
export const update = (id, data) => request.put(`/admin/tasks/${id}`, data)
export const remove = (id) => request.delete(`/admin/tasks/${id}`)
export const getSignups = (id) => request.get(`/admin/tasks/${id}/signups`)
export const approveSignup = (id, signupId) => request.put(`/admin/tasks/${id}/signups/${signupId}/approve`)
export const rejectSignup = (id, signupId) => request.put(`/admin/tasks/${id}/signups/${signupId}/reject`)
