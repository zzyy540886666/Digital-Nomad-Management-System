import request from '@/utils/request'

export const getList = (params) => request.get('/admin/posts', { params })
export const getDetail = (id) => request.get(`/admin/posts/${id}`)
export const approve = (id) => request.put(`/admin/posts/${id}/approve`)
export const reject = (id, reason) => request.put(`/admin/posts/${id}/reject`, { reason })
export const remove = (id) => request.delete(`/admin/posts/${id}`)
