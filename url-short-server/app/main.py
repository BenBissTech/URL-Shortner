# Imports:
# Flask - flask server, redirect long url from database to short url, render_template used to render the server through the client app
# Firebase_admin - used to connect to the firebase database
# os - get into app operating system to render the file for the static pages of the webpage

from flask import Flask, redirect, render_template
import firebase_admin
from firebase_admin import db
import os

# creates object for a credential certificate to grant access to the firebase database
cred_obj = firebase_admin.credentials.Certificate('./ServiceAccountKey.json')

# creates object with access to firebase database via credential certificate and firebase URL
default_app = firebase_admin.initialize_app(cred_obj, 
    {'databaseURL' : 'https://console.firebase.google.com/u/0/project/url-short-d694b/database/url-short-d694b-default-rtdb/data/~2F'})

# initialize flask app
app = Flask(__name__, static_folder='./build/static', template_folder="./build")

# app routing depending on URL
@app.route("/")
def home():
    return redirect("/app")

@app.route("/app")
def homepage():
    return render_template('index.html')

# routing to longURL from shortURL
@app.route('/<path:generatedKey>', methods=['GET'])
def fetch_from_firebase(generatedKey):
    ref = db.reference("/" + generatedKey)
    data = ref.get()
    if not data:
        return "404 not found"
    else:
        longURL = data['longURL']
        return redirect(longURL)