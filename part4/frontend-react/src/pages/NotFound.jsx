import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <section className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8 text-center max-w-lg w-full">
                    <p className="text-sm font-semibold text-gray-400 mb-2">404</p>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Page not found</h1>
                    <p className="text-gray-500 mb-6">
                        Cette route n'existe pas ou a été déplacée.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to home
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    )
}
