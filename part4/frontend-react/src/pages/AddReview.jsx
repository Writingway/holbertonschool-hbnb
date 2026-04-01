import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { apiRequest, getAuthHeaders } from '../lib/api'
import { useToast } from '../context/ToastContext'

export default function AddReview() {
    const { placeId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { token } = useAuth()
    const { addToast } = useToast()

    const [text, setText] = useState('')
    const [rating, setRating] = useState('5')
    const [loading, setLoading] = useState(false)
    const [placeTitle, setPlaceTitle] = useState(location.state?.placeTitle || 'Chargement...')

    useEffect(() => {
        let isMounted = true

        async function loadPlaceTitle() {
            if (location.state?.placeTitle) return

            try {
                const place = await apiRequest(`/places/${placeId}`)
                if (!isMounted) return
                setPlaceTitle(place?.title || 'ce logement')
            } catch {
                if (!isMounted) return
                setPlaceTitle('ce logement')
            }
        }

        loadPlaceTitle()

        return () => {
            isMounted = false
        }
    }, [location.state?.placeTitle, placeId])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!token) {
            navigate('/login')
            return
        }

        if (text.trim().length < 10) {
            addToast('L\'avis doit contenir au moins 10 caractères', 'error')
            return
        }

        setLoading(true)

        try {
            await apiRequest('/reviews/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(token)
                },
                body: JSON.stringify({
                    text,
                    rating: Number(rating),
                    place_id: placeId
                })
            })

            addToast('Avis publié avec succès !', 'success')
            navigate(`/place/${placeId}`)
        } catch (err) {
            addToast(`Erreur : ${err.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main id="main-content" className="flex-1">
                <div className="container-max section">
                    <div className="max-w-2xl">
                        {/* Header */}
                        <div className="mb-10">
                            <Link 
                                to={`/place/${placeId}`}
                                className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-semibold mb-6"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Retour au logement
                            </Link>
                            
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                                Partagez votre avis
                            </h1>
                            <p className="text-xl text-gray-600">
                                Aidez d'autres voyageurs en partageant votre expérience sur <span className="font-semibold">{placeTitle}</span>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-8">
                            {/* Rating Field */}
                            <fieldset className="space-y-4">
                                <legend className="text-lg font-bold text-gray-900">
                                    Comment évaluez-vous ce logement ?
                                </legend>
                                <div className="grid grid-cols-5 gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <label key={star} className="cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={star}
                                                checked={rating === String(star)}
                                                onChange={(e) => setRating(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`h-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all ${
                                                rating === String(star)
                                                    ? 'border-accent bg-accent text-white'
                                                    : 'border-gray-300 bg-gray-50 text-gray-900 group-hover:border-accent'
                                            }`}>
                                                {star}★
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600">
                                    1 = Pas satisfait • 5 = Très satisfait
                                </p>
                            </fieldset>

                            {/* Review Text Field */}
                            <div>
                                <label htmlFor="reviewText" className="block text-lg font-bold text-gray-900 mb-3">
                                    Votre avis
                                </label>
                                <p className="text-sm text-gray-600 mb-3">
                                    Minimum 10 caractères. Soyez honnête et constructif.
                                </p>
                                <textarea
                                    id="reviewText"
                                    value={text}
                                    onChange={(event) => setText(event.target.value)}
                                    required
                                    minLength={10}
                                    maxLength={500}
                                    rows={8}
                                    className="input resize-none"
                                    placeholder="Décrivez votre expérience (confort, propreté, communication avec le propriétaire, etc.)"
                                    aria-describedby="reviewHint"
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <p id="reviewHint" className="text-xs text-gray-500">
                                        {text.length}/500 caractères
                                    </p>
                                    {text.length < 10 && (
                                        <span className="text-xs text-error">
                                            {10 - text.length} caractères minimum
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading || text.trim().length < 10}
                                    className="btn btn-primary flex-1"
                                    aria-busy={loading}
                                >
                                    {loading ? 'Publication en cours...' : 'Publier mon avis'}
                                </button>
                                <Link
                                    to={`/place/${placeId}`}
                                    className="btn btn-secondary flex-1 text-center"
                                >
                                    Annuler
                                </Link>
                            </div>
                        </form>

                        {/* Info Box */}
                        <div className="bg-gray-50 rounded-lg p-6 mt-8 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-2">Conseils pour un bon avis</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>✓ Soyez spécifique et détaillé</li>
                                <li>✓ Respectez la vie privée des autres</li>
                                <li>✓ Évitez le spam et les liens externes</li>
                                <li>✓ Reportez les avis inappropriés</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
