import request from '@/utils/request'

export const getList = (params) => request.get('/admin/leads', { params })
export const getDetail = (id) => request.get(`/admin/leads/${id}`)
export const updateStatus = (id, status, note) => request.put(`/admin/leads/${id}/status`, { status, note })
export const exportLeads = (params) => request.get('/admin/leads/export', { params, responseType: 'blob' })
