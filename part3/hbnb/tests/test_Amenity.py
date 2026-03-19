import unittest
from app import create_app


class TestReviewEndpoints(unittest.TestCase):
    """
    Class for testing Amenity-related API endpoints.
    """
    testid = ""

    def setUp(self):
        """
        initialize the test client and app context.
        """
        self.app = create_app()
        self.client = self.app.test_client()

    """
    --POST--
    """
    def test_create_Amenity(self):
        """
        Test creating a new user with valid data.
        """
        response = self.client.post('/api/v1/amenities/', json={
            "name": "WI-FI",
        }, follow_redirects=False)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json['name'], "WI-FI")

    def test_create_Amenity_invalid_data(self):
        """
        Test creating a new user with invalid data.
        """
        response = self.client.post('/api/v1/amenities/', json={
            "name": "",
        }, follow_redirects=False)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    """
    --GET--
    """
    def test_fetch_Amenity_fetchall(self):
        """
        Test fetching all amenities.
        """
        response = self.client.get('/api/v1/amenities/')
        self.assertEqual(response.status_code, 200)

    def test_fetch_Amenity_fetchid(self):
        """
        Test fetching amenity with id.
        """
        create_user = self.client.post('/api/v1/amenities/', json={
            "name": "WI-FI"
        })
        self.assertEqual(create_user.status_code, 201)
        self.assertEqual(create_user.json["name"], "WI-FI")
        self.testid = create_user.json["id"]
        response = self.client.get('/api/v1/amenities/' + self.testid)
        self.assertEqual(response.status_code, 200)

    def test_fetch_Amenity_fetch_invalid_id(self):
        """
        Test fetching invalid amenity.
        """
        amenityid = "zadazdazd"
        response = self.client.get('/api/v1/amenities/' + amenityid)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json["error"], 'Amenity not found')

    """
    --PUT--
    """
    def test_update_Amenity(self):
        """
        Test updating amenity.
        """
        create_user = self.client.post('/api/v1/amenities/', json={
            "name": "WI-FI"
        })
        self.assertEqual(create_user.status_code, 201)
        self.assertEqual(create_user.json["name"], "WI-FI")
        self.testid = create_user.json["id"]
        response = self.client.put('/api/v1/amenities/' + self.testid, json={
            "name": "pepito",
        })
        self.assertEqual(response.status_code, 200)

    def test_update_Amenity_invalid_id(self):
        """
        Test updating invalid id.
        """
        response = self.client.put('/api/v1/amenities/' + "azdzadazda", json={
            "name": "pepito",
        })
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json['error'], 'Amenity not found')

    def test_update_Amenity_invalid_text(self):
        """
        Test updating invalid id.
        """
        create_user = self.client.post('/api/v1/amenities/', json={
            "name": "WI-FI"
        })
        self.assertEqual(create_user.status_code, 201)
        self.assertEqual(create_user.json["name"], "WI-FI")
        self.testid = create_user.json["id"]
        response = self.client.put('/api/v1/amenities/' + self.testid, json={
            "name": "",
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')
