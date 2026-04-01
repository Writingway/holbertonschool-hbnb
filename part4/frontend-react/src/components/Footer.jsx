import { Link } from 'react-router-dom'

export default function Footer({ simple = false }) {
    const currentYear = new Date().getFullYear()

    if (simple) {
        return (
            <footer className="mt-auto border-t border-brand-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-6 text-center">
                    <p className="text-sm font-semibold text-gray-900">HBnB</p>
                    <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-600">
                        <Link to="/" className="hover:text-accent">Accueil</Link>
                        <Link to="/login" className="hover:text-accent">Connexion</Link>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">© {currentYear} HBnB</p>
                </div>
            </footer>
        )
    }

    return (
        <footer className="mt-auto border-t border-brand-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center md:hidden">
                <p className="text-sm font-semibold text-gray-900">HBnB</p>
                <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-600">
                    <Link to="/" className="hover:text-accent">Accueil</Link>
                    <Link to="/login" className="hover:text-accent">Connexion</Link>
                </div>
                <p className="mt-3 text-xs text-gray-500">© {currentYear} HBnB</p>
            </div>

            <div className="container-max hidden py-12 md:block">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <h3 className="mb-3 text-lg font-bold text-gray-900">HBnB</h3>
                        <p className="max-w-md text-sm leading-relaxed text-gray-600">
                            Une facon plus simple de trouver un logement de confiance pour vos vacances, week-ends et deplacements.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">Navigation</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/" className="hover:text-accent">Accueil</Link></li>
                            <li><Link to="/login" className="hover:text-accent">Connexion</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="mailto:contact@hbnb.com" className="hover:text-accent">contact@hbnb.com</a></li>
                            <li><a href="https://github.com/Writingway/holbertonschool-hbnb" target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-brand-200 pt-5 text-xs text-gray-500">
                    © {currentYear} HBnB. Tous droits reserves.
                </div>
            </div>
        </footer>
    )
}
