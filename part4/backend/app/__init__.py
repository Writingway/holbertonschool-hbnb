from flask import Flask, redirect, request
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, get_jwt, verify_jwt_in_request
from flask_jwt_extended.exceptions import JWTExtendedException
from flask_cors import CORS


bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()


def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    CORS(app)
    # Load configuration from the specified config class
    app.config.from_object(config_class)
    bcrypt.init_app(app)
    db.init_app(app)
    jwt.init_app(app)

    # Configuration de la sécurité pour Swagger
    authorizations = {
        'apiKey': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'JWT token - Add "Bearer " before the token'
        }
    }

    api = Api(
        app,
        version='1.0',
        title='HBnB API',
        description='HBnB Application API',
        doc='/api/v1/',
        authorizations=authorizations
    )

    @app.before_request
    def restrict_swagger_to_admin():
        """Allow Swagger/API docs only to authenticated admins."""
        path = request.path
        swagger_paths = {
            '/api/v1/',
            '/api/v1',
            '/swagger.json',
            '/api/v1/swagger.json',
        }

        if path not in swagger_paths:
            return None

        try:
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get('is_admin'):
                return None
        except JWTExtendedException:
            pass

        # Redirection demandee pour les non-admins
        return redirect('/', code=302)

    from app.api.v1.users import api as users_ns
    from app.api.v1.amenities import api as amenities_ns
    from app.api.v1.places import api as places_ns
    from app.api.v1.reviews import api as reviews_ns
    from app.api.v1.auth import api as auth_ns
    from app.api.v1.protected import api as protected_ns

    # Register the users namespace
    api.add_namespace(users_ns, path='/api/v1/users')
    # Register the amenities namespace
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    # Register the places namespace
    api.add_namespace(places_ns, path='/api/v1/places')
    # Register the reviews namespace
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    # Authentication namespace
    api.add_namespace(auth_ns, path='/api/v1/auth')
    # Protected endpoint
    api.add_namespace(protected_ns, path='/api/v1')

    return app
