from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restx import Namespace, Resource, fields

api = Namespace('protected', description='Protected operations')

model_protected = api.model('Protected', {
    'token_header': fields.String(
        required=True,
        description='JWT token in the Authorization header',
    )
})


@api.route('/protected')
class ProtectedResource(Resource):
    @api.expect(model_protected)
    @jwt_required()
    def get(self):
        """A protected endpoint that requires a valid JWT token"""
        # Retrieve the user's identity from the token
        current_user = get_jwt_identity()
        # Check admin claim from JWT additional claims.
        current_all_user = get_jwt()
        if not current_all_user.get('is_admin'):
            return {'error': 'Admin access required'}, 403

        # additional_claims = get_jwt()
        # additional claims["is_admin"] -> True or False
        return {'message': f'Hello, user {current_user}'}, 200
