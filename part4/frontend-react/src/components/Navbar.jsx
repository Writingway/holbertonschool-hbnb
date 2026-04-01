import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
    const { token, isAdmin, logout } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-brand-200/80 bg-white/95 backdrop-blur">

            <nav className="container-max h-20 flex items-center justify-between gap-4" role="navigation" aria-label="Navigation principale">
                <Link
                    to="/"
                    className="flex items-center gap-3 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="HBnB - Accueil"
                >
                    <img src="/images/logo.png" alt="" className="h-8 w-auto" />
                    <span className="hidden text-sm font-semibold tracking-wide text-gray-900 sm:inline"></span>
                </Link>

                <div className="hidden rounded-full border border-brand-200 bg-brand-50 px-1 py-1 md:flex md:items-center md:gap-1">
                    <Link
                        to="/"
                        className="rounded-full px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-white"
                    >
                        Sejours
                    </Link>
                    {token && isAdmin && (
                        <>
                            <span className="h-5 w-px bg-brand-200" aria-hidden="true" />
                            <Link
                                to="/admin"
                                className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white"
                                aria-label="Panel administrateur"
                            >
                                Admin
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {!token ? (
                        <Link
                            to="/login"
                            className="btn btn-primary btn-sm"
                            aria-label="Se connecter"
                        >
                            Connexion
                        </Link>
                    ) : (
                        <button
                            onClick={logout}
                            className="rounded-full border border-brand-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label="Se déconnecter"
                        >
                            Deconnexion
                        </button>
                    )}

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-full border border-brand-300 p-2 text-gray-700 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-accent md:hidden"
                        aria-label="Ouvrir le menu"
                        aria-expanded={mobileOpen}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="border-t border-brand-200 bg-white p-4 md:hidden">
                    <div className="space-y-2 rounded-2xl border border-brand-200 bg-brand-50 p-3">
                        <Link
                            to="/"
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                            onClick={() => setMobileOpen(false)}
                        >
                            Sejours
                        </Link>
                        {token && isAdmin && (
                            <Link
                                to="/admin"
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                                onClick={() => setMobileOpen(false)}
                            >
                                Admin
                            </Link>
                        )}
                        {!token ? (
                            <Link
                                to="/login"
                                className="block rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white"
                                onClick={() => setMobileOpen(false)}
                            >
                                Connexion
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    logout()
                                    setMobileOpen(false)
                                }}
                                className="block w-full rounded-lg border border-brand-300 px-3 py-2 text-sm font-semibold text-gray-700"
                            >
                                Deconnexion
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}