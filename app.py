from flask import Flask, render_template, request, redirect, session, url_for
import secrets

SECRET_FILE = 'static/secret.txt'
PIN_CAP = 1000000

app = Flask(__name__)

# TODO: replace with DB
users = {}

# Generates a random PIN for the user and associates their data with the PIN in the database
def set_pin(name : str, items : list):
    # TODO: make sure check/update are atomic
    # TODO: make PINs time out somehow so we don't permanently run out of options

    # Generate random pin
    initial_pin = secrets.randbelow(PIN_CAP)

    # Make sure pin is not already in use
    pin = initial_pin
    if pin in users.keys():
        while pin in users.keys() and pin != initial_pin:
            pin = (pin + 1) % PIN_CAP
        if pin == initial_pin:
            pass # TODO: Insert error handling here

    # Add group to DB, associated with pin
    users[pin] = (name,items)

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
    with open(SECRET_FILE) as fp:
        app.secret_key = fp.readline()
    
    # Save pin in session
    session['pin'] = pin
    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    pin = session.pop('pin', None)

    # TODO: replace this with DB access
    name, items = users[pin]
    return  render_template('dashboard.html', pin=pin) # TODO: integrate name, pin, and items into dashboard template

# In case you want to go back to having link direct to /submit, and then having 
# that redirect to /vote, remember to use: return redirect('/vote',code=307)

@app.route('/vote', methods=['POST'])
def vote():
    return render_template('vote.html')

@app.route('/results')
def results():
    return  render_template('results.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')