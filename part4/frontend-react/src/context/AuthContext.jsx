import { createContext, useContext, useState, useEffect } from 'react'

// 1. Crée le contexte (le "canal" partagé)
const AuthContext = createContext(null)

// 2. Helpers cookie (tu les avais déjà en vanilla JS)
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
}

function decodeTokenPayload(token) {
    try {
        const payloadPart = token.split('.')[1]
        if (!payloadPart) return null

        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
        return JSON.parse(atob(padded))
    } catch {
        return null
    }
}

function isTokenExpired(token) {
    const payload = decodeTokenPayload(token)
    if (!payload) return true
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
}

function getValidToken() {
    const token = getCookie('token')
    if (!token) return null
    if (isTokenExpired(token)) {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        return null
    }
    return token
}

// 3. Le Provider — il englobe l'app et fournit le token à tout le monde
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => getValidToken())
    const payload = token ? decodeTokenPayload(token) : null
    const currentUserId = payload?.sub || null
    const isAdmin = Boolean(payload?.is_admin)

    // Vérifie l'expiration toutes les 30 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            const valid = getValidToken()
            setToken(valid)
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    const login = (newToken) => {
        document.cookie = `token=${newToken}; path=/`
        setToken(newToken)
    }

    const logout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, currentUserId, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// 4. Hook custom pour utiliser le contexte facilement
export function useAuth() {
    return useContext(AuthContext)
}