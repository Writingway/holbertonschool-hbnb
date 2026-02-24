from app.models.place import Place
from app.models.user import User
from app.models.review import Review
from app.models.amenity import Amenity


def test_user_creation():
    user = User(first_name="John", last_name="Doe", email="john.doe@example.com")
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john.doe@example.com"
    assert user.is_admin is False  # Default value
    print("User creation test passed!")


def test_place_creation():
    owner = User(first_name="Alice", last_name="Smith", email="alice.smith@example.com")
    place = Place(title="Cozy Apartment", description="A nice place to stay", price=100.0, latitude=37.7749, longitude=-122.4194, owner=owner)

    # Adding a review
    review = Review(text="Great stay!", rating=5, place=place, user=owner)
    place.add_review(review)

    # Adding a review
    review = Amenity(name="Wifi")
    place.add_amenity(review)

    assert place.title == "Cozy Apartment"
    assert place.price == 100.0
    assert len(place.reviews) == 1
    assert len(place.amenities) == 1
    assert place.reviews[0].text == "Great stay!"
    print("Place creation and relationship test passed!")
    print("Place details:", place.to_dict())


test_user_creation()
test_place_creation()
