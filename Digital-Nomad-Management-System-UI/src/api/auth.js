import request from '@/utils/request'

export const login = (data) => request.post('/admin/auth/login', data)
export const logout = () => request.post('/admin/auth/logout')
export const getProfile = () => request.get('/admin/auth/profile')
