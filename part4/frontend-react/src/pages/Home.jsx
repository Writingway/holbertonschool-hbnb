import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PlaceCard from '../components/PlaceCard'
import { apiRequest } from '../lib/api'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PRICE_FILTERS = [
    { value: '10', label: 'Jusqu\'a 10EUR' },
    { value: '50', label: 'Jusqu\'a 50EUR' },
    { value: '100', label: 'Jusqu\'a 100EUR' },
    { value: 'all', label: 'Tous les prix' },
]

const FEATURES = [
    {
        title: 'Selection premium',
        text: 'Des adresses verifiees, bien situees et pensees pour un vrai confort.',
        icon: (
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        )
    },
    {
        title: 'Confiance partagee',
        text: 'Des avis utiles et une communaute active pour choisir sans doute.',
        icon: (
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 1112 0 6 6 0 01-12 0z" />
        )
    },
    {
        title: 'Reservation rapide',
        text: 'Un parcours court et lisible, de la recherche a la confirmation.',
        icon: (
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 011-1h5a1 1 0 011 1v1h1V3a1 1 0 011 1v1h1.5a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5H3.5A1.5 1.5 0 012 16.5v-13A1.5 1.5 0 013.5 2H5V1a1 1 0 011-1z" clipRule="evenodd" />
        )
    }
]

export default function Home() {
    const { token } = useAuth()
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [maxPrice, setMaxPrice] = useState('all')

    useEffect(() => {
        let isMounted = true

        async function loadPlaces() {
            try {
                const data = await apiRequest('/places/')
                if (!isMounted) return
                setPlaces(Array.isArray(data) ? data : [])
                setLoading(false)
            } catch (err) {
                if (!isMounted) return
                setError(err.message)
                setLoading(false)
            }
        }

        loadPlaces()

        return () => {
            isMounted = false
        }
    }, [])

    const filtered = places.filter(place =>
        maxPrice === 'all' || place.price <= parseInt(maxPrice)
    )

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main id="main-content" className="flex-1">
                <section className="bg-gradient-to-b from-brand-50 via-white to-white pb-14 pt-14 md:pb-20 md:pt-20">
                    <div className="container-max">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                            <div>
                                <p className="badge mb-4">
                                    Escapades verifiees
                                </p>
                                <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                                    Se sentir chez soi,
                                    <br />
                                    partout.
                                </h1>
                                <p className="mb-8 max-w-xl text-lg leading-relaxed text-gray-700 md:text-xl">
                                    Des logements soigneusement selectionnes, une experience simple, et la bonne adresse au bon moment.
                                </p>
                                <button
                                    onClick={() => document.getElementById('listings').scrollIntoView({ behavior: 'smooth' })}
                                    className="btn btn-primary w-full sm:w-auto"
                                >
                                    Explorer les logements
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 h-52 overflow-hidden rounded-3xl bg-brand-100 sm:h-64">
                                    <img src="/images/maison1.jpg" alt="Vue d'une destination" className="h-full w-full object-cover" />
                                </div>
                                <div className="h-40 overflow-hidden rounded-3xl bg-brand-100 sm:h-48">
                                    <img src="/images/maison2.jpg" alt="Interieur cosy" className="h-full w-full object-cover" />
                                </div>
                                <div className="h-40 overflow-hidden rounded-3xl bg-brand-100 sm:h-48">
                                    <img src="/images/maison3.jpg" alt="Terrasse lumineuse" className="h-full w-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section bg-white">
                    <div className="container-max">
                        <div className="mb-12 max-w-2xl">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                Une experience claire et rassurante
                            </h2>
                            <p className="text-lg text-gray-700">
                                Chaque etape est pensee pour que vous trouviez plus vite, reserviez plus sereinement, et profitiez davantage.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {FEATURES.map(feature => (
                                <div key={feature.title} className="card p-7">
                                    <div className="icon-badge mb-5">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            {feature.icon}
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-700">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="listings" className="section bg-brand-50/50">
                    <div className="container-max">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                                    Logements disponibles
                                </h2>
                                <p className="text-lg text-gray-700">
                                    {filtered.length} logement{filtered.length !== 1 ? 's' : ''} correspond{filtered.length !== 1 ? 'ent' : ''} a votre recherche
                                </p>
                            </div>
                        </div>

                        <div className="mb-10 rounded-3xl border border-brand-200 bg-white p-5 md:p-6">
                            <label htmlFor="price-filter" className="mb-3 block text-sm font-semibold text-gray-900">
                                Budget maximal par nuit
                            </label>
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <select
                                    id="price-filter"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                    className="input w-full md:max-w-xs"
                                    aria-describedby="filter-help"
                                >
                                    {PRICE_FILTERS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <p id="filter-help" className="text-sm text-gray-600">
                                    Filtrez rapidement les options selon votre enveloppe.
                                </p>
                            </div>
                        </div>

                        {loading && (
                            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="card overflow-hidden rounded-3xl animate-pulse" aria-hidden="true">
                                        <div className="h-48 bg-gray-300" />
                                        <div className="space-y-3 p-6">
                                            <div className="h-5 w-2/3 rounded bg-gray-300" />
                                            <div className="h-4 w-1/2 rounded bg-gray-300" />
                                            <div className="h-6 w-1/3 rounded bg-gray-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-3xl border border-error bg-error/10 p-8 text-center text-error">
                                <h3 className="mb-2 text-lg font-bold">Erreur de chargement</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {!loading && !error && filtered.length === 0 && (
                            <div className="py-16 text-center">
                                <div className="mb-4 text-5xl">🔍</div>
                                <h3 className="mb-2 text-2xl font-bold text-gray-900">Aucun resultat</h3>
                                <p className="mb-6 text-gray-700">Essayez d'ajuster votre filtre de prix.</p>
                                <button onClick={() => setMaxPrice('all')} className="btn btn-outline">
                                    Reinitialiser les filtres
                                </button>
                            </div>
                        )}

                        {!loading && !error && filtered.length > 0 && (
                            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                                {filtered.map(place => (
                                    <PlaceCard key={place.id} place={place} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="section bg-white">
                    <div className="container-max text-center">
                        <div className="mx-auto max-w-4xl rounded-3xl bg-brand-700 px-6 py-12 text-white md:px-10 md:py-16">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Planifiez votre prochain sejour
                            </h2>
                            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                                Creez votre compte et commencez a enregistrer vos logements preferes.
                            </p>
                            {token ? (
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-white sm:w-auto"
                                >
                                    Continuer
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-white sm:w-auto"
                                >
                                    Commencer
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
