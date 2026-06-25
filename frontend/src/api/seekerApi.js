import axiosInstance from './axiosInstance'

export const seekerApi = {
  // Profile
  getProfile:    ()       => axiosInstance.get('/api/seeker/profile'),
  updateProfile: (data)   => axiosInstance.put('/api/seeker/profile', data),

  // Resume
  uploadResume: (formData) =>
    axiosInstance.post('/api/seeker/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Skills
  getMySkills:  ()        => axiosInstance.get('/api/seeker/skills'),
  addSkill:     (data)    => axiosInstance.post('/api/seeker/skills', data),
  removeSkill:  (skillId) => axiosInstance.delete(`/api/seeker/skills/${skillId}`),

  // Applications
  applyForJob:        (jobId, data) => axiosInstance.post(`/api/seeker/jobs/${jobId}/apply`, data),
  getMyApplications:  ()            => axiosInstance.get('/api/seeker/applications'),
  withdrawApplication:(id)          => axiosInstance.delete(`/api/seeker/applications/${id}`),

  // Saved jobs
  saveJob:        (jobId) => axiosInstance.post(`/api/seeker/jobs/${jobId}/save`),
  unsaveJob:      (jobId) => axiosInstance.delete(`/api/seeker/jobs/${jobId}/save`),
  getSavedJobs:   ()      => axiosInstance.get('/api/seeker/saved-jobs'),

  // Recommendations
  getRecommendations:  ()      => axiosInstance.get('/api/recommendations'),
  getScoreForJob:      (jobId) => axiosInstance.get(`/api/recommendations/${jobId}/score`),
}
