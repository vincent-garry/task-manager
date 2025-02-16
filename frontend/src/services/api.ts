import axios from 'axios'

const api = axios.create({
    baseURL: '/backend',  // Utilise le même chemin que PassengerBaseURI
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api