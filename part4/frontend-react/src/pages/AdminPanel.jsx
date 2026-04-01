import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiRequest, getAuthHeaders } from '../lib/api'

const TAB_ORDER = ['places', 'amenities', 'users', 'reviews']
const TAB_LABELS = {
    places: 'Logements',
    amenities: 'Equipements',
    users: 'Utilisateurs',
    reviews: 'Avis'
}

export default function AdminPanel() {
    const { token } = useAuth()
    const { addToast } = useToast()

    const [activeTab, setActiveTab] = useState('places')
    const [loading, setLoading] = useState(false)

    const [places, setPlaces] = useState([])
    const [amenities, setAmenities] = useState([])
    const [users, setUsers] = useState([])
    const [reviews, setReviews] = useState([])

    const [newAmenityName, setNewAmenityName] = useState('')
    const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '', password: '' })
    const [newPlace, setNewPlace] = useState({
        title: '',
        description: '',
        price: '',
        latitude: '',
        longitude: '',
        amenitiesCsv: ''
    })

    const authHeaders = useMemo(() => ({ ...getAuthHeaders(token) }), [token])

    async function adminRequest(path, options = {}) {
        const headers = {
            ...authHeaders,
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(options.headers || {})
        }

        return apiRequest(path, {
            ...options,
            headers
        })
    }

    async function loadAllData() {
        setLoading(true)
        try {
            const [placesData, amenitiesData, usersData, reviewsData] = await Promise.all([
                adminRequest('/places/'),
                adminRequest('/amenities/'),
                adminRequest('/users/'),
                adminRequest('/reviews/')
            ])

            setPlaces(Array.isArray(placesData) ? placesData : [])
            setAmenities(Array.isArray(amenitiesData) ? amenitiesData : [])
            setUsers(Array.isArray(usersData) ? usersData : [])
            setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        } catch (err) {
            addToast(`Erreur chargement admin: ${err.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAllData()
    }, [])

    async function createAmenity(event) {
        event.preventDefault()
        try {
            const created = await adminRequest('/amenities/', {
                method: 'POST',
                body: JSON.stringify({ name: newAmenityName.trim() })
            })
            setAmenities((previous) => [...previous, created])
            setNewAmenityName('')
            addToast('Amenity cree.', 'success')
        } catch (err) {
            addToast(`Erreur creation amenity: ${err.message}`, 'error')
        }
    }

    async function renameAmenity(amenityId, name) {
        try {
            await adminRequest(`/amenities/${amenityId}`, {
                method: 'PUT',
                body: JSON.stringify({ name })
            })
            addToast('Amenity mise a jour.', 'success')
        } catch (err) {
            addToast(`Erreur update amenity: ${err.message}`, 'error')
        }
    }

    async function createUser(event) {
        event.preventDefault()
        try {
            const created = await adminRequest('/users/', {
                method: 'POST',
                body: JSON.stringify(newUser)
            })
            setUsers((previous) => [...previous, created])
            setNewUser({ first_name: '', last_name: '', email: '', password: '' })
            addToast('Utilisateur cree.', 'success')
        } catch (err) {
            addToast(`Erreur creation user: ${err.message}`, 'error')
        }
    }

    async function createPlace(event) {
        event.preventDefault()

        const amenities = newPlace.amenitiesCsv
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)

        try {
            const payload = {
                title: newPlace.title.trim(),
                description: newPlace.description.trim(),
                price: Number(newPlace.price),
                latitude: Number(newPlace.latitude),
                longitude: Number(newPlace.longitude),
                amenities
            }

            const created = await adminRequest('/places/', {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            setPlaces((previous) => [...previous, created])
            setNewPlace({
                title: '',
                description: '',
                price: '',
                latitude: '',
                longitude: '',
                amenitiesCsv: ''
            })
            addToast('Logement cree.', 'success')
        } catch (err) {
            addToast(`Erreur creation logement: ${err.message}`, 'error')
        }
    }

    async function updatePlace(place) {
        try {
            await adminRequest(`/places/${place.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: place.title,
                    description: place.description,
                    price: Number(place.price)
                })
            })
            addToast('Logement mis a jour.', 'success')
        } catch (err) {
            addToast(`Erreur update logement: ${err.message}`, 'error')
        }
    }

    async function deletePlace(placeId) {
        try {
            await adminRequest(`/places/${placeId}`, { method: 'DELETE' })
            setPlaces((previous) => previous.filter((place) => place.id !== placeId))
            addToast('Logement supprime.', 'success')
        } catch (err) {
            addToast(`Erreur suppression logement: ${err.message}`, 'error')
        }
    }

    function handleDeletePlace(placeId) {
        const confirmed = window.confirm('Confirmer la suppression de ce logement ?')
        if (!confirmed) return
        deletePlace(placeId)
    }

    async function updateReview(review) {
        try {
            await adminRequest(`/reviews/${review.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    text: review.text,
                    rating: Number(review.rating),
                    user_id: review.user_id,
                    place_id: review.place_id
                })
            })
            addToast('Review mise a jour.', 'success')
        } catch (err) {
            addToast(`Erreur update review: ${err.message}`, 'error')
        }
    }

    async function deleteReview(reviewId) {
        try {
            await adminRequest(`/reviews/${reviewId}`, { method: 'DELETE' })
            setReviews((previous) => previous.filter((review) => review.id !== reviewId))
            addToast('Review supprimee.', 'success')
        } catch (err) {
            addToast(`Erreur suppression review: ${err.message}`, 'error')
        }
    }

    function handleTabKeyDown(event, tab) {
        const currentIndex = TAB_ORDER.indexOf(tab)
        if (currentIndex === -1) return

        if (event.key === 'ArrowRight') {
            event.preventDefault()
            const nextIndex = (currentIndex + 1) % TAB_ORDER.length
            setActiveTab(TAB_ORDER[nextIndex])
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            const previousIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length
            setActiveTab(TAB_ORDER[previousIndex])
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white">
            <a href="#admin-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-white border border-gray-300 rounded px-3 py-2 text-sm z-[120]">
                Aller au contenu admin
            </a>
            <Navbar />

            <main id="admin-content" className="container-max py-6 md:py-10 flex-1">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Panneau Administrateur</h1>
                    <p className="text-gray-600 mt-2">Gestion des ressources backend avec acces securise.</p>
                </header>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" aria-label="Indicateurs administrateur">
                    <div className="card p-4">
                        <p className="text-xs uppercase font-semibold text-gray-500">Logements</p>
                        <p className="text-2xl font-bold text-deep-space-blue">{places.length}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-xs uppercase font-semibold text-gray-500">Equipements</p>
                        <p className="text-2xl font-bold text-deep-space-blue">{amenities.length}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-xs uppercase font-semibold text-gray-500">Utilisateurs</p>
                        <p className="text-2xl font-bold text-deep-space-blue">{users.length}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-xs uppercase font-semibold text-gray-500">Avis</p>
                        <p className="text-2xl font-bold text-deep-space-blue">{reviews.length}</p>
                    </div>
                </section>

                <div className="card p-4 mb-6">
                    <div className="flex flex-wrap gap-2 items-center" role="tablist" aria-label="Sections administrateur">
                        {TAB_ORDER.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                id={`tab-${tab}`}
                                role="tab"
                                aria-selected={activeTab === tab}
                                aria-controls={`panel-${tab}`}
                                onClick={() => setActiveTab(tab)}
                                onKeyDown={(event) => handleTabKeyDown(event, tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-slate ${
                                    activeTab === tab
                                        ? 'bg-deep-space-blue text-eggshell'
                                        : 'bg-eggshell text-deep-space-blue hover:bg-dusty-denim/30'
                                }`}
                            >
                                {TAB_LABELS[tab]}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={loadAllData}
                            className="btn btn-primary btn-sm w-full sm:ml-auto sm:w-auto"
                            aria-label="Rafraichir les donnees administrateur"
                        >
                            Rafraichir
                        </button>
                    </div>
                </div>

                {loading && <p className="text-deep-space-blue font-medium" role="status" aria-live="polite">Chargement des donnees...</p>}

                {!loading && activeTab === 'amenities' && (
                    <section id="panel-amenities" role="tabpanel" aria-labelledby="tab-amenities" className="space-y-4">
                        <form onSubmit={createAmenity} className="card p-4 flex gap-3 flex-wrap">
                            <label htmlFor="new-amenity-name" className="sr-only">Nom de la nouvelle amenity</label>
                            <input
                                id="new-amenity-name"
                                required
                                value={newAmenityName}
                                onChange={(event) => setNewAmenityName(event.target.value)}
                                placeholder="Nom du nouvel equipement"
                                className="input flex-1"
                            />
                            <button type="submit" className="btn btn-primary btn-sm">
                                Ajouter
                            </button>
                        </form>

                        <div className="space-y-2">
                            {amenities.map((amenity) => (
                                <AmenityRow key={amenity.id} amenity={amenity} onSave={renameAmenity} />
                            ))}
                        </div>
                    </section>
                )}

                {!loading && activeTab === 'users' && (
                    <section id="panel-users" role="tabpanel" aria-labelledby="tab-users" className="space-y-4">
                        <form onSubmit={createUser} className="card p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label htmlFor="new-user-first-name" className="sr-only">Prenom</label>
                            <input
                                id="new-user-first-name"
                                required
                                value={newUser.first_name}
                                onChange={(event) => setNewUser((previous) => ({ ...previous, first_name: event.target.value }))}
                                placeholder="Prenom"
                                className="input"
                            />
                            <label htmlFor="new-user-last-name" className="sr-only">Nom</label>
                            <input
                                id="new-user-last-name"
                                required
                                value={newUser.last_name}
                                onChange={(event) => setNewUser((previous) => ({ ...previous, last_name: event.target.value }))}
                                placeholder="Nom"
                                className="input"
                            />
                            <label htmlFor="new-user-email" className="sr-only">Email</label>
                            <input
                                id="new-user-email"
                                required
                                type="email"
                                value={newUser.email}
                                onChange={(event) => setNewUser((previous) => ({ ...previous, email: event.target.value }))}
                                placeholder="Email"
                                className="input"
                            />
                            <label htmlFor="new-user-password" className="sr-only">Mot de passe</label>
                            <input
                                id="new-user-password"
                                required
                                type="password"
                                value={newUser.password}
                                onChange={(event) => setNewUser((previous) => ({ ...previous, password: event.target.value }))}
                                placeholder="Mot de passe"
                                className="input"
                            />
                            <button type="submit" className="md:col-span-2 btn btn-primary">
                                Creer utilisateur
                            </button>
                        </form>

                        <div className="card p-4 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500">
                                        <th className="py-2">ID</th>
                                        <th className="py-2">Name</th>
                                        <th className="py-2">Email</th>
                                        <th className="py-2">Admin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-t border-gray-100">
                                            <td className="py-2 pr-2 max-w-44 truncate">{user.id}</td>
                                            <td className="py-2">{user.first_name} {user.last_name}</td>
                                            <td className="py-2">{user.email}</td>
                                            <td className="py-2">{String(Boolean(user.is_admin))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {!loading && activeTab === 'places' && (
                    <section id="panel-places" role="tabpanel" aria-labelledby="tab-places" className="space-y-4">
                        <form onSubmit={createPlace} className="card p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label htmlFor="new-place-title" className="sr-only">Titre</label>
                            <input
                                id="new-place-title"
                                required
                                value={newPlace.title}
                                onChange={(event) => setNewPlace((previous) => ({ ...previous, title: event.target.value }))}
                                placeholder="Titre"
                                className="input"
                            />
                            <label htmlFor="new-place-price" className="sr-only">Prix</label>
                            <input
                                id="new-place-price"
                                required
                                type="number"
                                step="0.01"
                                value={newPlace.price}
                                onChange={(event) => setNewPlace((previous) => ({ ...previous, price: event.target.value }))}
                                placeholder="Prix"
                                className="input"
                            />
                            <label htmlFor="new-place-latitude" className="sr-only">Latitude</label>
                            <input
                                id="new-place-latitude"
                                required
                                type="number"
                                step="0.000001"
                                value={newPlace.latitude}
                                onChange={(event) => setNewPlace((previous) => ({ ...previous, latitude: event.target.value }))}
                                placeholder="Latitude"
                                className="input"
                            />
                            <label htmlFor="new-place-longitude" className="sr-only">Longitude</label>
                            <input
                                id="new-place-longitude"
                                required
                                type="number"
                                step="0.000001"
                                value={newPlace.longitude}
                                onChange={(event) => setNewPlace((previous) => ({ ...previous, longitude: event.target.value }))}
                                placeholder="Longitude"
                                className="input"
                            />
                            <label htmlFor="new-place-amenities" className="sr-only">IDs equipements</label>
                            <input
                                id="new-place-amenities"
                                value={newPlace.amenitiesCsv}
                                onChange={(event) => setNewPlace((previous) => ({ ...previous, amenitiesCsv: event.target.value }))}
                                placeholder="IDs equipements (separes par des virgules)"
                                className="md:col-span-2 input"
                            />
                            <label htmlFor="new-place-description" className="sr-only">Description</label>
                            <textarea
                                id="new-place-description"
                                value={newPlace.description}
                                onChange={(event) => setNewPlace((previous) => ({ ...previous, description: event.target.value }))}
                                placeholder="Description"
                                className="md:col-span-2 input"
                            />
                            <button type="submit" className="md:col-span-2 btn btn-primary">
                                Creer logement
                            </button>
                        </form>

                        <div className="space-y-2">
                            {places.map((place) => (
                                <PlaceRow
                                    key={place.id}
                                    place={place}
                                    users={users}
                                    onSave={updatePlace}
                                    onDelete={handleDeletePlace}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {!loading && activeTab === 'reviews' && (
                    <section id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" className="space-y-2">
                        {reviews.map((review) => (
                            <ReviewRow
                                key={review.id}
                                review={review}
                                onSave={updateReview}
                                onDelete={deleteReview}
                            />
                        ))}
                    </section>
                )}
            </main>

            <Footer />
        </div>
    )
}

function AmenityRow({ amenity, onSave }) {
    const [name, setName] = useState(amenity.name)

    return (
        <div className="card p-3 flex gap-2 flex-wrap">
            <label htmlFor={`amenity-${amenity.id}`} className="sr-only">Nom amenity {amenity.id}</label>
            <input
                id={`amenity-${amenity.id}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input flex-1"
            />
            <button type="button" onClick={() => onSave(amenity.id, name)} className="btn btn-secondary btn-sm" aria-label={`Sauvegarder amenity ${amenity.id}`}>
                Sauvegarder
            </button>
        </div>
    )
}

function PlaceRow({ place, users, onSave, onDelete }) {
    const [draft, setDraft] = useState({
        id: place.id,
        title: place.title || '',
        description: place.description || '',
        price: place.price || 0,
        latitude: place.latitude || '',
        longitude: place.longitude || '',
        owner_id: place.owner_id || ''
    })

    const ownerFromUsers = users?.find((user) => String(user.id) === String(draft.owner_id))
    const ownerDisplayName = ownerFromUsers
        ? `${ownerFromUsers.first_name || ''} ${ownerFromUsers.last_name || ''}`.trim()
        : `${place.owner?.first_name || ''} ${place.owner?.last_name || ''}`.trim()

    return (
        <article className="card p-3" aria-label={`Logement ${place.id}`}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Proprietaire</p>
                    <p className="text-sm text-gray-700 break-all">{ownerDisplayName || 'Utilisateur inconnu'}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Latitude</p>
                    <p className="text-sm text-gray-700">{draft.latitude || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Longitude</p>
                    <p className="text-sm text-gray-700">{draft.longitude || 'N/A'}</p>
                </div>
            </div>

            <p className="text-xs text-gray-500 mb-2">Champs modifiables via API actuelle: title, description, price.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <label htmlFor={`place-title-${place.id}`} className="sr-only">Titre</label>
                <input
                    id={`place-title-${place.id}`}
                    value={draft.title}
                    onChange={(event) => setDraft((previous) => ({ ...previous, title: event.target.value }))}
                    className="input"
                    placeholder="Title"
                />

                <label htmlFor={`place-price-${place.id}`} className="sr-only">Prix</label>
                <input
                    id={`place-price-${place.id}`}
                    value={draft.price}
                    type="number"
                    step="0.01"
                    onChange={(event) => setDraft((previous) => ({ ...previous, price: event.target.value }))}
                    className="input"
                    placeholder="Price"
                />

                <label htmlFor={`place-description-${place.id}`} className="sr-only">Description</label>
                <input
                    id={`place-description-${place.id}`}
                    value={draft.description}
                    onChange={(event) => setDraft((previous) => ({ ...previous, description: event.target.value }))}
                    className="input"
                    placeholder="Description"
                />

                <div className="flex gap-2">
                    <button type="button" onClick={() => onSave(draft)} className="flex-1 btn btn-secondary btn-sm" aria-label={`Sauvegarder logement ${place.id}`}>
                        Sauvegarder
                    </button>
                    <button type="button" onClick={() => onDelete(place.id)} className="flex-1 btn btn-sm bg-red-600 text-white hover:bg-red-700 focus:ring-red-700" aria-label={`Supprimer logement ${place.id}`}>
                        Supprimer
                    </button>
                </div>
            </div>
        </article>
    )
}

function ReviewRow({ review, onSave, onDelete }) {
    const [draft, setDraft] = useState({
        id: review.id,
        text: review.text || '',
        rating: review.rating || 1,
        user_id: review.user_id,
        place_id: review.place_id
    })

    return (
        <div className="card p-3 grid grid-cols-1 md:grid-cols-5 gap-2">
            <label htmlFor={`review-text-${review.id}`} className="sr-only">Texte review</label>
            <input id={`review-text-${review.id}`} value={draft.text} onChange={(event) => setDraft((previous) => ({ ...previous, text: event.target.value }))} className="md:col-span-2 input" />
            <label htmlFor={`review-rating-${review.id}`} className="sr-only">Note review</label>
            <input id={`review-rating-${review.id}`} value={draft.rating} type="number" min="1" max="5" onChange={(event) => setDraft((previous) => ({ ...previous, rating: event.target.value }))} className="input" />
            <div className="text-xs text-gray-500 px-2 py-2">{review.id}</div>
            <div className="flex gap-2">
                <button type="button" onClick={() => onSave(draft)} className="flex-1 btn btn-secondary btn-sm" aria-label={`Sauvegarder review ${review.id}`}>
                    Sauvegarder
                </button>
                <button type="button" onClick={() => onDelete(review.id)} className="flex-1 btn btn-sm bg-red-600 text-white hover:bg-red-700 focus:ring-red-600" aria-label={`Supprimer review ${review.id}`}>
                    Supprimer
                </button>
            </div>
        </div>
    )
}
