import request from '@/utils/request'

export const getList = () => request.get('/admin/community-groups')
export const update = (id, data) => request.put(`/admin/community-groups/${id}`, data)
export const updateQrCode = (id, qrCodeUrl) => request.put(`/admin/community-groups/${id}/qrcode`, { qrCodeUrl })
