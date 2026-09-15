import axiosInstance from './axiosInstance'

export const notificationApi = {
  getMyNotifications: async () => {
    const response = await axiosInstance.get('/api/notifications')
    return response.data
  },
  getUnreadCount: async () => {
    const response = await axiosInstance.get('/api/notifications/unread-count')
    return response.data
  },
  markAsRead: async (id) => {
    const response = await axiosInstance.patch(`/api/notifications/${id}/read`)
    return response.data
  },
  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/api/notifications/read-all')
    return response.data
  },
}
