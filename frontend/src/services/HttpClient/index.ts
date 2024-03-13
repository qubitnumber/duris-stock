import axios from 'axios'
import constant from '../constant'

const user = JSON.parse(localStorage.getItem('user') || '{}')

const requestWithNoToken = axios.create({
    baseURL: import.meta.env.VITE_SERVER_S_API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
        timeout: 5000,
    }
})

const requestWithToken = axios.create({
    baseURL: import.meta.env.VITE_SERVER_S_API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
        timeout: 5000,
        Authorization:`Bearer ${user.token}`,
    }
})

const requestWithRefreshToken = axios.create({
    baseURL: import.meta.env.VITE_SERVER_S_API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
        timeout: 5000,
        Authorization:`Bearer ${user.refreshToken}`,
    }
})

requestWithToken.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { auth } = constant

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data }  = await requestWithRefreshToken.get(`${auth}/refresh`)
                if (data) {
                    const { email, accessToken, refreshToken} = data
                    localStorage.setItem('user', JSON.stringify({ email, token: accessToken, refreshToken }))
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
                }
            } catch (error) {
                console.log(error);
            }
        }
        return Promise.reject(error);
    }
    );


export default {
    requestWithNoToken,
    requestWithToken,
    requestWithRefreshToken,
}