import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
    const { token, isAdmin } = useAuth()
    const location = useLocation()

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}
