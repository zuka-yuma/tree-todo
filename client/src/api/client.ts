import axios, { type AxiosInstance } from 'axios'

const BaseUrl = '/api'
let accessToken: string | null = null

export const client: AxiosInstance = axios.create({
    baseURL: BaseUrl,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true,
})

export const refreshClient: AxiosInstance = axios.create({
    baseURL: BaseUrl,
    headers: { 'Content-Type': 'application/json'},
    responseType: 'json',
    withCredentials: true,
})

client.interceptors.request.use(config => {
    if (config.headers !== undefined) {
        const atoken = getAccessToken()
        if (atoken) {
            config.headers.Authorization = `Bearer ${atoken}`
        }
    }
    return config
})

client.interceptors.response.use(
    response => {
        return response
    },
    async error => {
        const originalRequest = error.config
        if (error.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await refresh()
            return client(originalRequest)
        }
        return Promise.reject(error)
    }
)

export async function refresh() {
    return await refreshClient.post("/auth/refresh")
    .then(req => {
        setAccessToken(req.data.accessToken)
    })
}

export function getAccessToken(): string|null {
    return accessToken
}

export function setAccessToken(atoken: string|null) {
    accessToken = atoken
}