import axiosInstance from './axiosInstance'

export const adminApi = {
  getDashboard:    ()       => axiosInstance.get('/api/admin/dashboard'),
  getAllUsers:      ()       => axiosInstance.get('/api/admin/users'),
  toggleBlockUser: (id)     => axiosInstance.patch(`/api/admin/users/${id}/block`),
  deleteUser:      (id)     => axiosInstance.delete(`/api/admin/users/${id}`),
  getAllRecruiters: ()       => axiosInstance.get('/api/admin/recruiters'),
  getAllJobs:       ()       => axiosInstance.get('/api/admin/jobs'),
  deleteJob:       (id)     => axiosInstance.delete(`/api/admin/jobs/${id}`),
  createSkill:     (data)   => axiosInstance.post('/api/skills', data),
}
