async function loginUser(email, password) {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        window.location.href = 'index.html';
        console.log('Login successful, token stored in cookie');
    } else {
        alert('Login failed: ' + response.statusText);
    }
}

async function fetchPlaces(token) {
    if (!document.getElementById('places-container')) return;
    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:5000/api/v1/places/', {
        method: 'GET',
        headers
    });

    if (response.ok) {
        const data = await response.json();
        displayPlaces(data);
    } else {
        alert('Failed to fetch places: ' + response.statusText);
    }
}

async function fetchPlaceDetails(token, placeId) {
    if (!placeId) {
        return;
    }

    // Make a GET request to fetch place details
    // Include the token in the Authorization header
    // Handle the response and pass the data to displayPlaceDetails function
    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}`, {
        method: 'GET',
        headers
    });

    if (response.ok) {
        const data = await response.json();
        displayPlaceDetails(data);

        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = `Reviewing: ${data.title}`;
        }

    } else {
        alert('Failed to fetch place details: ' + response.statusText);
    }
}

async function submitReview(token, placeId, reviewText, rating) {
    // Make a POST request to submit review data
    // Include the token in the Authorization header
    // Send placeId and reviewText in the request body
    // Handle the response

    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:5000/api/v1/reviews/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: reviewText, place_id: placeId, rating: parseInt(rating) })
    });

    if (response.ok) {
        alert('Review submitted successfully!');
        window.location.href = `place.html?id=${placeId}`;
    } else {
        let errorMessage = response.statusText;

        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.msg || errorData.message || errorMessage;
        } catch (e) {
            // Keep HTTP status text when response body is not valid JSON.
        }

        alert('Failed to submit review: ' + errorMessage);
    }
}

function displayPlaceDetails(place) {
    // Clear the current content of the place details section
    // Create elements to display the place details (name, description, price, amenities and reviews)
    // Append the created elements to the place details section
    const placeDetailsSection = document.getElementById('place-details');

    if (!placeDetailsSection) return;
    placeDetailsSection.innerHTML = '';

    const amenityNames = Array.isArray(place.amenities)
        ? place.amenities.map(amenity => amenity.name).join(', ')
        : '';

    const placeDetailsCard = document.createElement('div');
    placeDetailsCard.className = 'place-details';
    placeDetailsCard.innerHTML = `
        <h2>${place.title}</h2>
        <div class="place-info">
            <p><span class="field-label">Host:</span> ${place.owner?.first_name || ''} ${place.owner?.last_name || ''}</p>
            <p><span class="field-label">Price:</span> $${place.price}</p>
            <p><span class="field-label">Description:</span> ${place.description || ''}</p>
            <p><span class="field-label">Amenities:</span> ${amenityNames}</p>
        </div>
    `;
    placeDetailsSection.appendChild(placeDetailsCard);

    const reviewsSection = document.getElementById('reviews');

    if (!reviewsSection) return;
    reviewsSection.innerHTML = '<h2>Reviews</h2>';

    if (Array.isArray(place.reviews) && place.reviews.length > 0) {
        place.reviews.forEach(review => {
            const rating = Number(review.rating) || 0;
            const reviewCard = document.createElement('div');

            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <p class="review-user">User ${review.user_id}:</p>
                <p class="review-text">${review.text || ''}</p>
                <p class="review-rating"><span class="field-label">Rating:</span> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
            `;

            reviewsSection.appendChild(reviewCard);
        });
    } else {
        const emptyReview = document.createElement('p');
        emptyReview.textContent = 'No reviews yet.';
        reviewsSection.appendChild(emptyReview);
    }

    const addReviewLink = document.createElement('a');
    addReviewLink.href = place?.id ? `add_review.html?id=${encodeURIComponent(place.id)}` : 'add_review.html';
    addReviewLink.className = 'details-button';
    addReviewLink.textContent = 'Add a Review';
    addReviewLink.style.display = getValidToken() ? 'inline-block' : 'none';
    reviewsSection.appendChild(addReviewLink);
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-container');

    if (!placesList) return;

    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h3 class="place-name">${place.title}</h3>
            <p class="place-price">Price per night: $${place.price}</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;
        placesList.appendChild(placeCard);
    });
}

function checkAuthentication() {
    const token = getValidToken();
    const loginLink = document.getElementById('login-link');
    const loginForm = document.getElementById('login-form');
    const addReviewLink = document.querySelector('a[href="add_review.html"]');
    const placeId = getPlaceIdFromURL();

    if (!token && document.getElementById('review-form')) {
        window.location.href = 'index.html';
        return;
    }
    // If user is already authenticated and currently on login page, skip showing form.
    if (token && loginForm) {
        window.location.href = 'index.html';
        return;
    }

    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'block';
    }

    if (addReviewLink) {
        addReviewLink.style.display = token ? 'inline-block' : 'none';
    }

    fetchPlaces(token);
    fetchPlaceDetails(token, placeId);
    return token;
}

function getPlaceIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function clearTokenCookie() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

function isTokenExpired(token) {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) return true;

        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const payload = JSON.parse(atob(padded));

        if (!payload.exp) return false;
        return Date.now() >= payload.exp * 1000;
    } catch (e) {
        return true;
    }
}

function getValidToken() {
    const token = getCookie('token');

    if (!token) return null;

    if (isTokenExpired(token)) {
        clearTokenCookie();
        return null;
    }

    return token;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const priceFilter = document.getElementById('price-filter');
    const reviewForm = document.getElementById('review-form');
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Get review text from form
            // Make AJAX request to submit review
            // Handle the response
            const reviewText = document.getElementById('review')?.value.trim();
            const rating = document.getElementById('rating')?.value;
            console.log('Submitting review:', { reviewText, rating, placeId, token });
            
            if (!reviewText || !rating) {
                alert('Please provide both review text and rating.');
                return;
            }
            const authToken = getValidToken();

            if (!authToken) {
                window.location.href = 'index.html';
                return;
            }

            submitReview(authToken, placeId, reviewText, rating);
        });
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selectedPrice = event.target.value;
            const placeCards = document.querySelectorAll('.place-card');

            placeCards.forEach(card => {
                const priceText = card.querySelector('.place-price')?.textContent || '';
                const price = parseInt(priceText.replace('Price per night: $', ''), 10);
                const maxPrice = parseInt(selectedPrice, 10);

                if (selectedPrice === 'all' || (!Number.isNaN(price) && price <= maxPrice)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('password')?.value;

            await loginUser(email, password);
        });
    }
});