import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? 'Unexpected error'
    const status  = error.response?.data?.statusCode ?? 500
    console.error(`API Error ${status}:`, message)
    return Promise.reject(error)
  }
)
