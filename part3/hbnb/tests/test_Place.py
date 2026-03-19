import unittest

from app import create_app


class TestPlaceEndpoints(unittest.TestCase):
    """
    Class for testing place-related API endpoints.
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
    def test_create_place(self):
        """
        Test creating a new place with valid data.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test",
            "last_name": "test",
            "email": "test@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test")
        self.assertEqual(response.json["last_name"], "test")
        self.assertEqual(response.json["email"], "test@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "")
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])
        self.assertEqual(response.json["rooms"], 3)
        self.assertEqual(response.json["surface"], 2)
        self.assertEqual(response.json["capacity"], 4)

    def test_create_place_invalid_title(self):
        """
        Test creating a new place with invalid title.
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

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "",
            "description": "",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')



    def test_create_place_invalid_description(self):
        """
        Test creating a new place with invalid description.
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

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "zadazkdazik aziokzdkzaoazd;kzpaok dpkdzka kazpokd zakopdkapkdzaopk azopkzdak opazk dzopakdop akdopaz kzaopkdopazkdazopkd opazkpozd kazpokd zaopkdopazk poazk azopdkdopaz kopazdk poazkpod kaopdkaz pokazdop kazopdk zaopkadzpo kazpodk azopkzdaop kdazk opazko kopakd azokdop azkopdkopadk opazk dopzak opkazopd kaopzkd aopzkdopaz kopakdop azkdpo azkpodkopakd poazkpo zodazàidkazàdk zakopzadkaoz doazkpodk zopazkopd kaopdk aop idkikiopdkpoazkd poazkpodkzapo dkzaopdkazpodkazop dkpodka zpokdzaop kopzdk aopzkdpoazkdopaz kpoazdk pozakdpoaz kpodkpoaz kaopkdzaopdk azopkdpoaz kazpodkazidjoazjdiuoazhd uauiodhaziudh azjdiekcoijdiuoj haziudhaziuhd iuahiuda",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_place_invalid_price(self):
        """
        Test creating a new place with invalid price.
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

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": -200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_place_invalid_latitude(self):
        """
        Test creating a new place with invalid latitude.
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

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": -92,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": 92,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')


    def test_create_place_invalid_longitude(self):
        """
        Test creating a new place with invalid longitude.
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

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": 12,
            "longitude": -200,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": 12,
            "longitude": -200,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_place_invalid_rooms(self):
        """
        Test creating a new place with invalid rooms
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test6",
            "last_name": "test6",
            "email": "test6@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test6")
        self.assertEqual(response.json["last_name"], "test6")
        self.assertEqual(response.json["email"], "test6@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": 12,
            "longitude": 30,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": -3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_place_invalid_surface(self):
        """
        Test creating a new place with invalid surface
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test7",
            "last_name": "test7",
            "email": "test7@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test7")
        self.assertEqual(response.json["last_name"], "test7")
        self.assertEqual(response.json["email"], "test7@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": 12,
            "longitude": 30,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": -2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_place_invalid_capacity(self):
        """
        Test creating a new place with invalid capacity
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test8",
            "last_name": "test8",
            "email": "test8@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test8")
        self.assertEqual(response.json["last_name"], "test8")
        self.assertEqual(response.json["email"], "test8@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "",
            "price": 3200,
            "latitude": 12,
            "longitude": 30,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": -4
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_create_place_invalid_owner_id(self):
        """
        Test creating a new place with invalid owner_id.
        """
        response = self.client.post('/api/v1/places/', json={
            "title": "abcd",
            "description": "",
            "price": 3200,
            "latitude": 20,
            "longitude": 340,
            "owner_id": "",
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json["error"], 'User not found')

        """
        --GET--
        """
    def test_fetch_place_fetchall(self):
        """
        Test fetch place fetching all.
        """
        response = self.client.get('/api/v1/places/')
        self.assertEqual(response.status_code, 200)

    def test_fetch_place_id(self):
        """
        Test fetch place fetching with id.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test9",
            "last_name": "test9",
            "email": "test9@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test9")
        self.assertEqual(response.json["last_name"], "test9")
        self.assertEqual(response.json["email"], "test9@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.get('/api/v1/places/' + placeid)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner"])
        self.assertFalse(response.json["amenities"])

    def test_fetch_place_invalid_id(self):
        """
        Test fetch place fetching all.
        """
        placeid = "invalid_id"
        response = self.client.get('/api/v1/places/' + placeid)
        self.assertEqual(response.status_code, 404)

    """
    --PUT--
    """
    def test_updating_place(self):
        """
        Test updating a place with valid data.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test10",
            "last_name": "test10",
            "email": "test10@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test10")
        self.assertEqual(response.json["last_name"], "test10")
        self.assertEqual(response.json["email"], "test10@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "updated Appartement",
            "description": "some updated Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Place updated successfully")

    def test_updating_place_invalid_title(self):
        """
        Test updating a place with invalid title.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test11",
            "last_name": "test11",
            "email": "test11@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test11")
        self.assertEqual(response.json["last_name"], "test11")
        self.assertEqual(response.json["email"], "test11@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "",
            "description": "some updated Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_place_invalid_description(self):
        """
        Test updating a place with invalid description.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test12",
            "last_name": "test12",
            "email": "test12@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test12")
        self.assertEqual(response.json["last_name"], "test12")
        self.assertEqual(response.json["email"], "test12@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "Appartement",
            "description": "some updated Appartement zadkazpdkzak azkdzkzapodopazkdopk pkazpkazopkdza kpozakldoakzpo kazpodka pokd zaopkdopazk opakzdop azkopdk aopzakopd kaopdzkaopdkazopdkzaopdkazop kazopkdzapod kaopkd poazkd poakdopakdopazkd pzakadpo kpoazkdpo akzpodk azkpdk azopdkaopz kdopazk opkazdop kazopdk aopkdpoazkdpozakdpo azkpkdazop kopda zopkdzopakpozdakop kaopkd opakzpod kazpokdaz kpodka zopkapkdpoa zkkdopazk pkapodkazkdpkaz dkpakdpo akzpokdop kapozdkop kazopdkazopdkpoazkd poakpodaz kopdk azpokd paozkopdk azpodkapzokdpoazkdpoakdaopkdaopzkdopaz kdopazkdaopzkdopazdkopadkzopkdpazkdazjkiodjkaz ijkaziodj ajdioazjdijkaz ioajd iojaiodjaoizdjioa zjdiod",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_place_invalid_price(self):
        """
        Test updating a place with invalid price.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test13",
            "last_name": "test13",
            "email": "test13@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test13")
        self.assertEqual(response.json["last_name"], "test13")
        self.assertEqual(response.json["email"], "test13@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "Appartement",
            "description": "some Appartement",
            "price": -200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_place_invalid_id(self):
        """
        Test updating a place with invalid place_id.
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test14",
            "last_name": "test14",
            "email": "test14@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test14")
        self.assertEqual(response.json["last_name"], "test14")
        self.assertEqual(response.json["email"], "test14@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = "invalid place"
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "Appartement",
            "description": "some Appartement",
            "price": -200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json["error"], 'Place not found')

    def test_updating_place_invalid_owner_id(self):
        """
        Test updating place with an invalid owner_id
        """
        owner_id = "random bs go"
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json["error"], 'User not found')

    def test_updating_place_invalid_rooms(self):
        """
        Test updating place with invalid rooms
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test15",
            "last_name": "test15",
            "email": "test15@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test15")
        self.assertEqual(response.json["last_name"], "test15")
        self.assertEqual(response.json["email"], "test15@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "Appartement",
            "description": "some Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": -3,
            "surface": 2,
            "capacity": 4
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_place_invalid_surface(self):
        """
        Test updating place with invalid surface
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test16",
            "last_name": "test16",
            "email": "test16@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test16")
        self.assertEqual(response.json["last_name"], "test16")
        self.assertEqual(response.json["email"], "test16@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "Appartement",
            "description": "some Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": -2,
            "capacity": 4
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')

    def test_updating_place_invalid_capacity(self):
        """
        Test updating place with invalid capacity
        """
        response = self.client.post('/api/v1/users/', json={
            "first_name": "test17",
            "last_name": "test17",
            "email": "test17@example.com"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["first_name"], "test17")
        self.assertEqual(response.json["last_name"], "test17")
        self.assertEqual(response.json["email"], "test17@example.com")

        owner_id = response.json["id"]
        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        response = self.client.post('/api/v1/places/', json={
            "title": "Appartement",
            "description": "some random Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": 4
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["id"])
        self.assertEqual(response.json["title"], "Appartement")
        self.assertEqual(response.json["description"], "some random Appartement")
        self.assertEqual(response.json["price"], 3200)
        self.assertEqual(response.json["latitude"], 12)
        self.assertEqual(response.json["longitude"], 34)
        self.assertTrue(response.json["owner_id"])

        placeid = response.json["id"]
        response = self.client.put('/api/v1/places/' + placeid, json={
            "title": "Appartement",
            "description": "some Appartement",
            "price": 3200,
            "latitude": 12,
            "longitude": 34,
            "owner_id": owner_id,
            "amenities": [],
            "rooms": 3,
            "surface": 2,
            "capacity": -4
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], 'Invalid input data')
