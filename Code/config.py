class Config(object):
    DEBUG = False
    TESTING = False
    CACHE_TYPE = 'RedisCache'
    CACHE_DEFAULT_TIMEOUT = 300

class DevelopmetConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///gsv2.sqlite3'
    SECRET_KEY = 'TheSecretKey256bitencoded'
    JWT_SECRET_KEY = 'TheSecretKey256bitencoded'
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3


