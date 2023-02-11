from flask import Flask
import psycopg2
import pandas as pd
from flask import jsonify, request, render_template
from flask.helpers import send_from_directory
from dbmanager import DbManager as dbm
from flask_cors import CORS,cross_origin

app = Flask(__name__, static_folder = 'frontend/build', static_url_path = '')
CORS(app)

@app.route("/")
def serve():
  return send_from_directory(app.static_folder, 'index.html')

@app.route("/test123")
def hello():
  with dbm() as db:
    db.cursor.execute("select * from votes")
    cols = db.cursor.fetchall()
  print(cols)
  return str(cols)

@app.route("/test")
def test():
  return "Testing"


@app.route("/getImages", methods = ['POST'])
@cross_origin()
def getImages():
  """ Returns json formatted list of image files {images: list(images)} """
  df = pd.read_csv("./frontend/public/assets/files.csv")
  print(df)
  return jsonify({"images": list(df.itertuples(index=False))})

@app.route("/checkRegistered", methods = ['POST'])
@cross_origin()
def checkRegistered():
  """ Returns boolean true if username already exists in the username column of the users table, otherwise false """
  form = request.get_json()
  username = form['username']
  with dbm() as db:
    resp = db.user_exists(username)
    print(resp)
    if resp != None:
      registered = True
      backgroundInfo = not (None in resp)

  return jsonify({"isRegistered": registered, "backgroundInfo":backgroundInfo})

@app.route("/recoverVotes", methods = ['POST'])
@cross_origin()
def recoverVotes():
  """ Returns json formatted list of votes that user has already made in database {votes: list((chosen, other), ...)} """
  form = request.get_json()
  username = form['username']
  with dbm() as db:
    votes = db.get_votes(username)
  return jsonify({"votes": list(votes)})

@app.route("/addUser", methods = ['POST'])
@cross_origin()
def addUserInfo():
  """ Adds new record to users table """
  form = request.get_json()
  print(form)
  username = form['username']
  age = form['age']
  country = form['country']
  region = form['region']
  ethnicity = form['ethnicity']
  gender = form['gender'].capitalize()
  with dbm() as db:
    db.update_details(username, age, gender, country, region, ethnicity)
  return jsonify({"success": True})

@app.route("/submitVotes", methods = ['POST'])
@cross_origin()
def submitVotes():
  """ Adds record to votes table for each new vote the user has made """
  form = request.get_json()
  username = form['username']
  votes = form['votes']
  with dbm() as db:

    db.add_votes(username, votes)

  return jsonify({"success": True})


if __name__ == "__main__":
  app.run()