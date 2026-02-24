from app.models.base_model import BaseModel


class Review(BaseModel):
    def __init__(self, user_id, place_id, text, rating):
        super().__init__()

        self.user_id = self._validate_field("user_id", user_id, str, 100, True)
        self.place_id = self._validate_field("place_id", place_id, str, 100, True)
        self.text = self._validate_field("text", text, str, None, True)
        self.rating = self._validate_field("rating", rating, int, None, True, min_value=1, max_value=5)
