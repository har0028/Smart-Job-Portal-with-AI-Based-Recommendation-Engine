import axiosInstance from './axiosInstance'

export const jobApi = {
  // Public
  searchJobs: (params) => axiosInstance.get('/api/jobs', { params }),
  getJobById: (id)     => axiosInstance.get(`/api/jobs/${id}`),

  // Skills (public read)
  getAllSkills:   (keyword) => axiosInstance.get('/api/skills', { params: keyword ? { keyword } : {} }),

  // Recruiter
  getMyJobs:   ()          => axiosInstance.get('/api/recruiter/jobs'),
  createJob:   (data)      => axiosInstance.post('/api/recruiter/jobs', data),
  updateJob:   (id, data)  => axiosInstance.put(`/api/recruiter/jobs/${id}`, data),
  deleteJob:   (id)        => axiosInstance.delete(`/api/recruiter/jobs/${id}`),
  getApplicants: (jobId)   => axiosInstance.get(`/api/recruiter/jobs/${jobId}/applicants`),
  updateApplicationStatus: (appId, data) =>
    axiosInstance.patch(`/api/recruiter/applications/${appId}/status`, data),
}
