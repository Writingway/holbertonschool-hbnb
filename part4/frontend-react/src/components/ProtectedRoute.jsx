import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { token } = useAuth()
    const location = useLocation()

    // Si non connecté, on redirige vers login en gardant la page d'origine.
    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return children
}
