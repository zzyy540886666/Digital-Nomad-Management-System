import request from '@/utils/request'

export const getDashboard = () => request.get('/admin/analytics/overview')
export const getFunnel = (params) => request.get('/admin/analytics/funnel', { params })
