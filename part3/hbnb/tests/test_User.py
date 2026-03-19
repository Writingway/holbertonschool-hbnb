import unittest
from app import create_app


class TestUserEndpoints(unittest.TestCase):
    """
    Class for testing user-related API endpoints.
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
    def test_create_user(self):
        """
        Test creating a new user with valid data.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], 'Jane')
        self.assertEqual(response.json["last_name"], 'Doe')
        self.assertEqual(response.json["email"], 'jane.doe@example.com')
        self.testid = response.json.get("id")

    def test_create_user_invalid_first_name(self):
        """
        Test creating a new user with invalid first name.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "",
            "last_name": "Doe",
            "email": "john.doe@example.com"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_user_invalid_last_name(self):
        """
        Test creating a new user with invalid last name.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "jhon",
            "last_name": "",
            "email": "john.doe@example.com"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_user_invalid_email(self):
        """
        Test creating a new user with invalid email.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "jhon",
            "last_name": "Doe",
            "email": "invalid-email"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_user_duplicate_email(self):
        """
        Test creating a new user with duplicate email.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@example.com"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['error'], 'Email already registered')

    """
    --GET--
    """
    def test_fetching_users_fetchall(self):
        """
        Test fetching all users.
        """
        response = self.client.get('/api/v1/users/')
        self.assertEqual(response.status_code, 200)

    def test_fetching_users_fetchid(self):
        """
        Test fetching user id.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test",
            "last_name": "test",
            "email": "test@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], 'test')
        self.assertEqual(response.json["last_name"], 'test')
        self.assertEqual(response.json["email"], 'test@example.com')
        testid = response.json.get("id")

        response = self.client.get('/api/v1/users/' + testid)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['id'])
        self.assertEqual(response.json['first_name'], "test")
        self.assertEqual(response.json['last_name'], "test")
        self.assertEqual(response.json['email'], "test@example.com")

    def test_fetching_users_invalidid(self):
        """
        Test fetching invalid user
        """
        response = self.client.get('/api/v1/users/' + "invalid id")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json["error"], 'User not found')

    """
    --PUT--
    """
    def test_updating_user(self):
        """
        Test updating a user.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test1",
            "last_name": "test1",
            "email": "test1@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test1")
        self.assertEqual(response.json["last_name"], "test1")
        self.assertEqual(response.json["email"], "test1@example.com")

        testid = response.json["id"]
        response = self.client.put('/api/v1/users/' + testid, json={
            "first_name": "jhon",
            "last_name": "Doe",
            "email": "whoopsi@example.com"
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["first_name"], "jhon")
        self.assertEqual(response.json["last_name"], "Doe")
        self.assertEqual(response.json["email"], "whoopsi@example.com")

    def test_updating_nonexistent_user(self):
        """
        Test updating a nonexistent user.
        """
        response = self.client.put('/api/v1/users/"user_id"', json={
            "first_name": "jhon",
            "last_name": "Doe",
            "email": "jane.doe@example.com"
        })
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json["error"], 'User not found')

    def test_updating_user_invalid_first_name(self):
        """
        Test updating with invalid first_name.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test2",
            "last_name": "test2",
            "email": "test2@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test2")
        self.assertEqual(response.json["last_name"], "test2")
        self.assertEqual(response.json["email"], "test2@example.com")

        testid = response.json["id"]
        response = self.client.put('/api/v1/users/' + testid, json={
            "first_name": "",
            "last_name": "Doe",
            "email": "tada@example.com"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_user_invalid_last_name(self):
        """
        Test updating with invalid last_name.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test3",
            "last_name": "test3",
            "email": "test3@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test3")
        self.assertEqual(response.json["last_name"], "test3")
        self.assertEqual(response.json["email"], "test3@example.com")

        testid = response.json["id"]
        response = self.client.put('/api/v1/users/' + testid, json={
            "first_name": "jhon",
            "last_name": "",
            "email": "nani@example.com"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_user_invalid_email(self):
        """
        Test updating with invalid email.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test4",
            "last_name": "test4",
            "email": "test4@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test4")
        self.assertEqual(response.json["last_name"], "test4")
        self.assertEqual(response.json["email"], "test4@example.com")

        testid = response.json["id"]
        response = self.client.put('/api/v1/users/' + testid, json={
            "first_name": "jhon",
            "last_name": "Doe",
            "email": "invalid-email"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_user_duplicate_email(self):
        """
        Test updating user with duplicate email
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test5",
            "last_name": "test5",
            "email": "test5@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test5")
        self.assertEqual(response.json["last_name"], "test5")
        self.assertEqual(response.json["email"], "test5@example.com")

        response = self.client.post('/api/v1/users/', json={
            "first_name": "test6",
            "last_name": "test6",
            "email": "test6@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test6")
        self.assertEqual(response.json["last_name"], "test6")
        self.assertEqual(response.json["email"], "test6@example.com")

        testid = response.json["id"]
        response = self.client.put('/api/v1/users/' + testid, json={
            "first_name": "test5",
            "last_name": "test5",
            "email": "test5@example.com"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Email already registered')
