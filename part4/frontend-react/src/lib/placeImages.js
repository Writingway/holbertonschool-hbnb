const DEFAULT_IMAGE = '/images/maison1.jpg'

// Option 1 (recommande): mappe chaque id de logement vers une image.
// Remplace les ids exemples par tes vrais ids API.
const IMAGE_BY_PLACE_ID = {
    'p1111111-1111-1111-1111-111111111111': '/images/maison1.jpg',
    'p2222222-2222-2222-2222-222222222222': '/images/maison2.jpg',
    'p3333333-3333-3333-3333-333333333333': '/images/maison3.jpg'
}

// Option 2: si tu ne veux pas gérer les ids, mappe par titre.
const IMAGE_BY_PLACE_TITLE = {
    'maison 1': '/images/maison1.jpg',
    'maison 2': '/images/maison2.jpg',
    'maison 3': '/images/maison3.jpg'
}

export function getPlaceImage(place) {
    if (!place) return DEFAULT_IMAGE

    const imageFromId = IMAGE_BY_PLACE_ID[String(place.id)]
    if (imageFromId) return imageFromId

    const normalizedTitle = String(place.title || '').trim().toLowerCase()
    const imageFromTitle = IMAGE_BY_PLACE_TITLE[normalizedTitle]
    if (imageFromTitle) return imageFromTitle

    return DEFAULT_IMAGE
}
