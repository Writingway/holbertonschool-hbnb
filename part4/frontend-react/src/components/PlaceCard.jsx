import { Link } from 'react-router-dom'
import { getPlaceImage } from '../lib/placeImages'

export default function PlaceCard({ place }) {
    const imageSrc = getPlaceImage(place)

    return (
        <Link
            to={`/place/${place.id}`}
            className="group block overflow-hidden rounded-3xl border border-brand-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
            <div className="relative h-56 overflow-hidden bg-brand-100">
                <img
                    src={imageSrc}
                    alt={place.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(event) => {
                        event.currentTarget.src = '/images/logo.png'
                    }}
                />
            </div>

            <div className="p-5">
                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-accent transition-colors">
                    {place.title}
                </h3>

                {place.description && (
                    <p className="mb-5 line-clamp-2 text-sm text-gray-600">
                        {place.description}
                    </p>
                )}

                <div className="flex items-end justify-between border-t border-brand-200 pt-4">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Par nuit</p>
                        <p className="text-2xl font-bold text-brand-700">{place.price}EUR</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-700">Voir details</span>
                </div>
            </div>
        </Link>
    )
}
