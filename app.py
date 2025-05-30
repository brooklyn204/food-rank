from flask import Flask, render_template, request, redirect, session, url_for
import secrets
from pathlib import Path
from common import cache

SECRET_FILE = 'static/secret.txt'
PIN_CAP = 1000000

app = Flask(__name__)

with open(SECRET_FILE) as fp:
    app.secret_key = fp.readline()

cache.init_app(app=app, config={"CACHE_TYPE": "filesystem",'CACHE_DIR': Path('/tmp')})
# TODO: replace with DB
cache.set('users', {})

# Generates a random PIN for the user and associates their data with the PIN in the database
def set_pin(name : str, items : list):
    # TODO: make sure check/update are atomic
    # TODO: make PINs time out somehow so we don't permanently run out of options

    # Generate random pin
    initial_pin = secrets.randbelow(PIN_CAP)

    # Make sure pin is not already in use
    pin = initial_pin
    users = cache.get('users')
    if pin in users.keys():
        while pin in users.keys() and pin != initial_pin:
            pin = (pin + 1) % PIN_CAP
        if pin == initial_pin:
            pass # TODO: Insert error handling here

    # Add group to DB, associated with pin
    users[pin] = (name,items)
    cache.set('users',users)

    return pin

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/makeagroup')
def makeagroup():
    return render_template('makeagroup.html')

@app.route('/savegroup', methods=['POST'])
def savegroup():
    # TODO: get real name and items (via POST request?)
    name = request.form['name']
    items = [request.form['option1'], request.form['option2'], request.form['option3']]

    pin = set_pin(name, items)

    # Set up app secret key TODO: maybe move this somewhere else?
    print('sk is',app.secret_key)
    
    # Save pin in session
    session['pin'] = pin
    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    pin = session.get('pin', None)

    # TODO: replace this with DB access
    name, items = cache.get('users')[pin]
    return  render_template('dashboard.html', pin=pin, name=name, items=items) # TODO: integrate name, pin, and items into dashboard template

# In case you want to go back to having link direct to /submit, and then having 
# that redirect to /vote, remember to use: return redirect('/vote',code=307)

@app.route('/vote', methods=['POST'])
def vote():
    # Fetch input pin from request
    group_code = request.form['group_code']
    try:
        input_pin = int(group_code)
    except Exception as e:
        # TODO: think of better error value?
        input_pin = -1

    # Find name and items corresponding to that pin
    users = cache.get('users')
    if input_pin in users:
        name, items = users[input_pin]
    else:
        # TODO: think of better defaults?
        name = ''
        items = []
    
    print(f'items is {items}, users is {users}')
    session['input_pin'] = input_pin # TODO: change this for better style? (We've now potentially got 'pin' and 'input_pin' floating around in session, seem like bad names)
    return render_template('vote.html', name=name, items=items)

@app.route('/results', methods=['POST'])
def results():
    input_pin = session.get('input_pin')
    # TODO: get votes from POST request, update results in DB

    users = cache.get('users')
    if input_pin in users:
        name, items = users[input_pin]
    else:
        # TODO: think of better defaults?
        name = ''
        items = []
    return  render_template('results.html', name=name, items=items)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')