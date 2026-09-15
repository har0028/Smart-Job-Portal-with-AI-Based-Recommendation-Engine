import axiosInstance from './axiosInstance'

export const paymentApi = {
  processPayment: async (paymentData) => {
    const response = await axiosInstance.post('/api/payments/process', paymentData)
    return response.data
  },
  getMyHistory: async () => {
    const response = await axiosInstance.get('/api/payments/my-history')
    return response.data
  },
  getRevenueStats: async () => {
    const response = await axiosInstance.get('/api/admin/revenue/stats')
    return response.data
  },
  getAllTransactions: async () => {
    const response = await axiosInstance.get('/api/admin/revenue/transactions')
    return response.data
  },
}
