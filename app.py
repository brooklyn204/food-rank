from flask import Flask, render_template, request, redirect, session, url_for
import secrets
from pathlib import Path
from config import Config
from models import db, User, Option
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

# Constants
SECRET_FILE = 'static/secret.txt'
DB_URI = 'sqlite:///app.db'
PIN_CAP = 1000000
ERROR = -1

# Create app
app = Flask(__name__)

# Configure app (with secret key and DB uri)
secret_key = None
with open(SECRET_FILE) as fp:
    secret_key = fp.readline()

app.config.update(
    SQLALCHEMY_TRACK_MODIFICATIONS = False,
    SQLALCHEMY_DATABASE_URI = DB_URI,
    SECRET_KEY = secret_key
)
db.init_app(app)

# Initialize DB
with app.app_context():
    db.create_all()


# Generates a random PIN for the user and associates their data with the PIN in the database
def set_pin(name : str, items : list):
    # TODO: make PINs time out somehow so we don't permanently run out of options

    # Generate random pin
    initial_pin = secrets.randbelow(PIN_CAP)
    print(f'Initial pin: {initial_pin}\n  Total contents of DB: {User.query.all()}') # TODO: clean up/remove testing print statements

    # Make sure pin is not already in use
    pin = initial_pin
    committed = False
    while not committed:
        # Find pin not (currently) in use
        if User.query.filter_by(pin=pin).first():
            while User.query.filter_by(pin=pin).first() and pin != initial_pin: # This is 'good enough' checking, but technically introduces potential a TOCTOU error, solved by the try-except block below
                pin = (pin + 1) % PIN_CAP
            
            # If we've checked all pins, there is no other option -- return error
            if pin == initial_pin:
                print('Error: ran out of pins')
                return ERROR
            
        # Add group to DB, associated with pin
        user = User(pin=pin, name=name)
        db.session.add(user)
        try:
            db.session.commit()
            committed = True
        except IntegrityError: # If race condition occurs, pins will overlap and this will rollback, forcing loop to try again
            db.session.rollback()

    # Add options to DB, associated with user
    for item in items:
        option = Option(pin=pin,name=item,votes=0)
        db.session.add(option)
    db.session.commit() # TODO: (maybe) put this in a try-except block?

    return pin

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/error')
def error():
    return render_template('error.html')

@app.route('/makeagroup')
def makeagroup():
    return render_template('makeagroup.html')

@app.route('/savegroup', methods=['POST'])
def savegroup():
    # Get POSTed variables, if they exist
    try:
        name = request.form['name']
        items = [request.form['option1'], request.form['option2'], request.form['option3']] # TODO: get real items via tags
    except Exception as e:
        return redirect('/error')
    
    pin = set_pin(name, items)
    if pin == ERROR:
        return redirect('/error') # Unique pin could not be found
    
    # Save pin in session
    session['pin'] = pin
    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    # Get pin, if it exists (if not, something has gone wrong)
    pin = session.get('pin', None)
    if pin == None:
        return redirect('/error')

    # TODO: replace this with DB access
    user = User.query.filter_by(pin=pin).first()
    name = user.name
    options = Option.query.filter_by(pin=pin).all()
    items = [op.name for op in options]
    print(f'Entered query select(User).where(User.pin == pin), got back {user} with name {user.name}, items {items}')

    return  render_template('dashboard.html', pin=pin, name=name, items=items) # TODO: integrate name, pin, and items into dashboard template

# In case you want to go back to having link direct to /submit, and then having 
# that redirect to /vote, remember to use: return redirect('/vote',code=307)

@app.route('/vote', methods=['POST'])
def vote():
    # Fetch input pin from request
    try:
        group_code = request.form['group_code']
        input_pin = int(group_code)
    except Exception as e:
        return redirect('/error')

    # Find name and items corresponding to that pin
    user = User.query.filter_by(pin=input_pin).first() # .first() ==> firstOrNone
    if user == None:
        # TODO: have it display an error message on homepage somehow telling them they had a bad code
        return redirect('/')
    name = user.name
    options = Option.query.filter_by(pin=input_pin).all()
    items = [op.name for op in options]
    
    session['input_pin'] = input_pin # TODO: change this for better style? (We've now potentially got 'pin' and 'input_pin' floating around in session, seem like bad names)
    
    return render_template('vote.html', name=name, items=items)

@app.route('/results', methods=['POST'])
def results():
    input_pin = session.get('input_pin')
    # TODO: get votes from POST request, update results in DB

    # Find name and items corresponding to input pin
    user = User.query.filter_by(pin=input_pin).first()
    if user == None:
        return redirect('/error')
    name = user.name
    options = Option.query.filter_by(pin=input_pin).all()
    items = [op.name for op in options]
    # TODO: move this ^^ repeated code into a helper function

    return  render_template('results.html', name=name, items=items)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')