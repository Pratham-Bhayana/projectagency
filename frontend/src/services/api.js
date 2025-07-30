const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  // Contact endpoints
  async submitContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  }

  // Project endpoints
  async getProjects(category = null) {
    const params = category && category !== 'All' ? `?category=${category}` : ''
    return this.request(`/projects${params}`)
  }

  async getFeaturedProjects() {
    return this.request('/projects/featured')
  }

  async getProjectCategories() {
    return this.request('/projects/categories')
  }

  async getProject(id) {
    return this.request(`/projects/${id}`)
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { baseURL: this.baseURL.replace('/api', '') })
  }
}

export default new ApiService()
