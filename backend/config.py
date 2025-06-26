import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    with open('static/secret.txt') as fp:
        SECRET_KEY = fp.readline()
        SQLALCHEMY_DATABASE_URI = fp.readline()