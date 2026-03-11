import os


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'ff866263-9b7a-45fb-82ec-2b8eac3137a9')
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True


config = {
    'development': DevelopmentConfig,
    'default': DevelopmentConfig
}
