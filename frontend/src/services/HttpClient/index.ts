import axios from 'axios'

export default axios.create({
    baseURL: import.meta.env.VITE_SERVER_S_API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
        timeout: 5000,
    }
})