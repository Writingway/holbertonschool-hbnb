import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/api'
import { useToast } from '../context/ToastContext'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const { addToast } = useToast()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            login(data.access_token)
            addToast('Connexion reussie !', 'success')
            navigate('/')
        } catch (err) {
            addToast(`Erreur : ${err.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main id="main-content" className="flex-1 px-4 py-8 sm:px-6 md:py-16">
                <div className="container-max">
                    <div className="grid grid-cols-1 gap-8 rounded-3xl border border-brand-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8 lg:p-10">
                        <section className="hidden rounded-3xl bg-brand-700 p-8 text-white md:block">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-80">Connexion</p>
                            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Ravi de vous revoir</h1>
                            <p className="max-w-md text-base opacity-90">
                                Connectez-vous pour retrouver vos logements favoris et laisser vos avis en quelques clics.
                            </p>
                        </section>

                        <section className="rounded-3xl border border-brand-200 p-5 md:p-8">
                            <h2 className="mb-1 text-2xl font-bold text-gray-900">Se connecter</h2>
                            <p className="mb-6 text-sm text-gray-600">Utilisez vos identifiants HBnB.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">
                                        Adresse email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="vous@exemple.com"
                                        className="input"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-900">
                                        Mot de passe
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input"
                                        disabled={loading}
                                    />
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-primary w-full" aria-busy={loading}>
                                    {loading ? 'Connexion en cours...' : 'Continuer'}
                                </button>
                            </form>
                        </section>
                    </div>
                </div>
            </main>

            <Footer simple />
        </div>
    )
}
