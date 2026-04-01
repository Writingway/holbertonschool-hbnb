const API_BASE_URL = 'http://localhost:5000/api/v1'

// Petit wrapper fetch: centralise la gestion JSON + erreurs HTTP.
export async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, options)

    let data = null
    try {
        data = await response.json()
    } catch {
        // Certaines réponses n'ont pas de body JSON.
    }

    if (!response.ok) {
        const message = data?.error || data?.msg || data?.message || response.statusText
        throw new Error(message)
    }

    return data
}

export function getAuthHeaders(token) {
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
}
