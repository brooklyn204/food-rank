from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    code = request.form['group_code']
    print(f"User entered: {code}")
    return f"You submitted: {code}"

if __name__ == '__main__':
    app.run(debug=True)