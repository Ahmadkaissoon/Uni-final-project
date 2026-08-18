import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

const apiUrl = import.meta.env.VITE_API_URL ?? "https://job-entry.obaidana.xyz"
const authTokenStorageKeys = ["access_token", "token", "auth_token"]
const refreshTokenStorageKey = "refresh_token"
const authRoutes = ["/login", "/register", "/reset-otp", "/verify-password"]

interface RefreshTokenResponse {
    accessToken?: string
    refreshToken?: string
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean
}

function readStoredAuthToken() {
    if (typeof window === "undefined") {
        return null
    }

    for (const key of authTokenStorageKeys) {
        const token =
            window.localStorage.getItem(key) ??
            window.sessionStorage.getItem(key)

        if (token?.trim()) {
            return token
        }
    }

    return null
}

function readStoredRefreshToken() {
    if (typeof window === "undefined") {
        return null
    }

    return (
        window.localStorage.getItem(refreshTokenStorageKey) ??
        window.sessionStorage.getItem(refreshTokenStorageKey)
    )
}

function storeAuthTokens(tokens: RefreshTokenResponse) {
    if (typeof window === "undefined") {
        return
    }

    if (tokens.accessToken) {
        window.localStorage.setItem("access_token", tokens.accessToken)
    }

    if (tokens.refreshToken) {
        window.localStorage.setItem(refreshTokenStorageKey, tokens.refreshToken)
    }
}

function clearAuthTokens() {
    if (typeof window === "undefined") {
        return
    }

    for (const key of [...authTokenStorageKeys, refreshTokenStorageKey]) {
        window.localStorage.removeItem(key)
        window.sessionStorage.removeItem(key)
    }
}

function redirectToLogin() {
    if (typeof window === "undefined") {
        return
    }

    const currentPath = `${window.location.pathname}${window.location.search}`

    if (
        authRoutes.some((route) => window.location.pathname.startsWith(route))
    ) {
        return
    }

    window.location.replace(
        `/login?redirect=${encodeURIComponent(currentPath)}`,
    )
}

let refreshTokenPromise: Promise<string | null> | null = null

const axiosClient = axios.create({
    baseURL: apiUrl,
    headers: {
        Accept: "application/json",
    },
})

async function refreshAccessToken() {
    const refreshToken = readStoredRefreshToken()

    if (!refreshToken?.trim()) {
        return null
    }

    const response = await axios.post<RefreshTokenResponse>(
        `${apiUrl.replace(/\/$/, "")}/auth/refresh`,
        undefined,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${refreshToken}`,
            },
        },
    )

    storeAuthTokens(response.data)
    return response.data.accessToken ?? null
}

axiosClient.interceptors.request.use((config) => {
    const token = readStoredAuthToken()
    const currentAuthorizationHeader =
        typeof config.headers.Authorization === "string"
            ? config.headers.Authorization.trim()
            : ""

    if (
        token &&
        (!currentAuthorizationHeader ||
            currentAuthorizationHeader === "Bearer null" ||
            currentAuthorizationHeader === "Bearer undefined")
    ) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | RetriableRequestConfig
            | undefined
        const status = error.response?.status

        if (
            status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
            refreshTokenPromise ??= refreshAccessToken().finally(() => {
                refreshTokenPromise = null
            })

            const accessToken = await refreshTokenPromise

            if (!accessToken) {
                clearAuthTokens()
                redirectToLogin()
                return Promise.reject(error)
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return axiosClient(originalRequest)
        } catch (refreshError) {
            clearAuthTokens()
            redirectToLogin()
            return Promise.reject(refreshError)
        }
    },
)

export default axiosClient
