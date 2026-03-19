import unittest
from app import create_app


class TestReviewEndpoints(unittest.TestCase):
    """
    Class for testing review-related API endpoints.
    """
    def setUp(self):
        """
        initialize the test client and app context.
        """
        self.app = create_app()
        self.client = self.app.test_client()

    """
    --POST--
    """
    def test_create_review(self):
        """
        Test creating a new review with valid data.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 201)

    def test_create_review_invalid_text(self):
        """
        Test creating a new review with invalid text.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 400)

    def test_create_review_invalid_rating(self):
        """
        Test creating a new review with invalid rating.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 400)

    def test_create_review_invalid_review_id(self):
        """
        Test creating a new review with invalid user_id.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 400)

    def test_create_review_invalid_place_id(self):
        """
        Test creating a new review with invalid place_id.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 400)

    """
    --GET--
    """
    def test_fetch_review_fetch_all(self):
        """
        Test fetching all reviews.
        """
        response = self.client.get('/api/v1/reviews/')
        self.assertEqual(response.status_code, 200)

    def test_fetch_review_id(self):
        """
        Test fetching review id.
        """
        review_id = "some_review_id"
        response = self.client.get('/api/v1/reviews/' + review_id)
        self.assertEqual(response.status_code, 200)

    def test_fetch_review_invalid_id(self):
        """
        Test fetching invalid id.
        """
        review_id = "invalid_review_id"
        response = self.client.get('/api/v1/reviews/' + review_id)
        self.assertEqual(response.status_code, 404)

    def test_fetch_review_place_id(self):
        """
        Test fetching invalid id.
        """
        placeid = ""
        response = self.client.get('/api/v1/' + placeid + '/reviews/')
        self.assertEqual(response.status_code, 200)

    def test_fetch_review_place_invalid_id(self):
        """
        Test fetching invalid id.
        """
        placeid = "invalid-id"
        response = self.client.get('/api/v1/' + placeid + '/reviews/')
        self.assertEqual(response.status_code, 404)

    """
    --PUT--
    """
    def test_update_review(self):
        """
        Test updating a review with valid data.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 201)

    def test_updating_review_invalid_text(self):
        """
        Test updating a review with invalid text.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 400)

    def test_updating_review_invalid_rating(self):
        """
        Test updating a review with invalid data.
        """
        response = self.client.post('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 400)

    """
    --DELETE--
    """
    def test_delete_review_valid(self):
        """
        Test deleting a new review with invalid data.
        """
        response = self.client.delete('/api/v1/reviews/', json={
            "text": "appartement nul",
            "rating": 0,
            "user_id": "Appartement",
            "place_id": "jhon",
        })
        self.assertEqual(response.status_code, 200)

    def test_delete_review_invalid_id(self):
        """
        Test deleting a new review with invalid data.
        """
        review_id = "invalid-id"
        response = self.client.delete('/api/v1/reviews/' + review_id)
        self.assertEqual(response.status_code, 200)
