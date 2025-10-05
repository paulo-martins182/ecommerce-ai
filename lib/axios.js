import axios from "axios"
import { useAuth } from "@clerk/nextjs"


const api = axios.create({
  baseURL: "/api",
})


api.interceptors.request.use(
  async (config) => {
    try {
      const { getToken } = await useAuth()
      const token = await getToken({ template: "default" })

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (err) {
      console.warn("Error to get clerk token", err)
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api
