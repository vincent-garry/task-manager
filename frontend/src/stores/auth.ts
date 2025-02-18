import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login', {
          email,
          password
        })
        
        if (response.data.access_token) {
          this.token = response.data.access_token
          this.user = response.data.user
          
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          
          return true
        }
        return false
      } catch (error) {
        console.error('Erreur de connexion:', error)
        return false
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})