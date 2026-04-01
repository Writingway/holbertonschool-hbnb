import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { apiRequest, getAuthHeaders } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getPlaceImage } from '../lib/placeImages'

function StarRating({ rating }) {
    const normalized = Math.max(0, Math.min(5, Number(rating) || 0))
    return (
        <div className="flex gap-1" aria-label={`${normalized}/5 stars`}>
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`h-4 w-4 ${i < normalized ? 'fill-accent text-accent' : 'fill-gray-300 text-gray-300'}`}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            ))}
        </div>
    )
}

export default function PlaceDetails() {
    const { placeId } = useParams()
    const { token, currentUserId } = useAuth()
    const { addToast } = useToast()

    const [place, setPlace] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deletingReviewId, setDeletingReviewId] = useState(null)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            setError(null)

            try {
                const [placeData, reviewsData] = await Promise.all([
                    apiRequest(`/places/${placeId}`),
                    apiRequest(`/places/${placeId}/reviews`)
                ])

                setPlace(placeData)
                setReviews(Array.isArray(reviewsData) ? reviewsData : [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [placeId])

    async function handleDeleteReview(reviewId) {
        const confirmed = window.confirm('Etes-vous sur de vouloir supprimer cet avis ?')
        if (!confirmed) return

        setDeletingReviewId(reviewId)

        try {
            await apiRequest(`/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeaders(token)
                }
            })

            setReviews((previousReviews) =>
                previousReviews.filter((review) => review.id !== reviewId)
            )
            addToast('Avis supprimé avec succès', 'success')
        } catch (err) {
            addToast(`Erreur : ${err.message}`, 'error')
        } finally {
            setDeletingReviewId(null)
        }
    }

    const currentUserReview = reviews.find(
        (review) => token && String(currentUserId) === String(review.user_id || review.user?.id)
    )

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main id="main-content" className="flex-1">
                {/* Loading State */}
                {loading && (
                    <div className="container-max section space-y-8 animate-pulse">
                        <div className="h-96 bg-gray-300 rounded-lg" />
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-300 rounded w-2/3" />
                            <div className="h-5 bg-gray-300 rounded w-1/2" />
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="container-max section">
                        <div className="bg-error/10 border border-error text-error rounded-lg p-8 text-center">
                            <h3 className="font-bold text-lg mb-2">Erreur de chargement</h3>
                            <p className="mb-6">{error}</p>
                            <Link to="/" className="btn btn-outline">
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && place && (
                    <>
                        {/* Hero Image Section */}
                        <div className="relative h-72 bg-gray-100 overflow-hidden md:h-96">
                            <img
                                src={getPlaceImage(place)}
                                alt={place.title}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                    event.currentTarget.src = '/images/logo.png'
                                }}
                            />
                            <div className="absolute top-6 left-6">
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                                    aria-label="Retour"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Retour
                                </Link>
                            </div>
                        </div>

                        <div className="container-max py-8 md:py-12">
                            <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                                {/* Main Content */}
                                <div className="lg:col-span-2">
                                    {/* Title & Description */}
                                    <section className="mb-12">
                                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                            {place.title}
                                        </h1>
                                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                            {place.description || 'Pas de description disponible'}
                                        </p>

                                        {/* Place Info Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 rounded-lg p-6">
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Prix par nuit</p>
                                                <p className="text-3xl font-bold text-accent">{place.price}€</p>
                                            </div>
                                            {place.owner && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Propriétaire</p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {place.owner.first_name} {place.owner.last_name}
                                                    </p>
                                                </div>
                                            )}
                                            {place.owner?.email && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Contact</p>
                                                    <a 
                                                        href={`mailto:${place.owner.email}`}
                                                        className="text-accent hover:text-accent-dark font-medium"
                                                        aria-label="Envoyer un email"
                                                    >
                                                        {place.owner.email}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {/* Reviews Section */}
                                    <section>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                            Avis des clients
                                        </h2>

                                        {reviews.length === 0 ? (
                                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                                <p className="text-gray-600 text-lg">
                                                    Aucun avis pour le moment.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {reviews.length} avis
                                                </p>
                                                {reviews.map((review) => (
                                                    <article 
                                                        key={review.id} 
                                                        className="card p-6"
                                                        role="article"
                                                        aria-label={`Avis de ${review.user?.first_name || 'utilisateur'}`}
                                                    >
                                                        {/* Reviewer Info */}
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 mb-5">
                                                                    {review.user?.first_name} {review.user?.last_name || 'Utilisateur'}
                                                                </h3>
                                                                <StarRating rating={review.rating} />
                                                            </div>
                                                            {token && String(currentUserId) === String(review.user_id || review.user?.id) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteReview(review.id)}
                                                                    disabled={deletingReviewId === review.id}
                                                                    className="text-error hover:text-error/80 font-semibold text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-error rounded px-2 py-1"
                                                                    aria-label="Supprimer cet avis"
                                                                >
                                                                    {deletingReviewId === review.id ? 'Suppression...' : 'Supprimer'}
                                                                </button>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Review Text */}
                                                        <p className="text-gray-700 leading-relaxed">
                                                            {review.text}
                                                        </p>
                                                    </article>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </div>

                                {/* Sidebar */}
                                <aside className="lg:col-span-1">
                                    {/* Add Review CTA */}
                                    <div className="card p-6 md:p-8 lg:sticky lg:top-24">
                                        {token && currentUserReview ? (
                                            <>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                    Avis deja publie
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4">
                                                    Vous avez deja laisse un avis sur ce logement. Merci pour votre retour.
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Vous pouvez supprimer votre avis actuel pour en publier un nouveau.
                                                </p>
                                            </>
                                        ) : token ? (
                                            <>
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                                    Partager votre expérience
                                                </h3>
                                            <Link
                                                to={`/place/${placeId}/review/new`}
                                                state={{ placeTitle: place.title }}
                                                className="btn btn-primary w-full"
                                            >
                                                Ajouter un avis
                                            </Link>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                                    Partager votre expérience
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4">
                                                    Connectez-vous pour partager votre avis sur ce logement
                                                </p>
                                                <Link
                                                    to="/login"
                                                    className="btn btn-primary w-full">
                                                    Se connecter
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}
