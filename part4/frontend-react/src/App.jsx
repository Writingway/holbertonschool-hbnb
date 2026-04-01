import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import PlaceDetails from './pages/PlaceDetails'
import AddReview from './pages/AddReview'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ToastViewport from './components/ToastViewport'
import AdminRoute from './components/AdminRoute'
import AdminPanel from './pages/AdminPanel'

export default function App() {
    return (
        <BrowserRouter>
            <ToastViewport />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/place/:placeId" element={<PlaceDetails />} />
                <Route
                    path="/place/:placeId/review/new"
                    element={
                        <ProtectedRoute>
                            <AddReview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}