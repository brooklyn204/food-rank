from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# TODO: rename these tables
# TODO: (long term) change to have options always the same/implement search/select/find by location and have an 'options_associated_with_user' intermediate table

class Option(db.Model):
    __tablename__ = 'options'
    id = db.Column(db.Integer, primary_key=True)
    pin = db.Column(db.Integer, db.ForeignKey("users.pin"))
    name = db.Column(db.String(64), unique=False, nullable=False)
    votes = db.Column(db.Integer, unique=False, nullable=False)

class User(db.Model):
    __tablename__ = 'users'
    pin = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=False, nullable=True)
    # Add time??