from flask import Flask
import pandas as pd
from flask import jsonify, request, render_template
from flask.helpers import send_from_directory
from dbmanager import DbManager as dbm
from flask_cors import CORS,cross_origin
import numpy as np
import random

app = Flask(__name__, static_folder = 'frontend/build', static_url_path = '')
CORS(app)

@app.route("/")
def serve():
  return send_from_directory(app.static_folder, 'index.html')

@app.route("/test123")
def hello():
  with dbm(None) as db:
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
  df = pd.read_csv("./frontend/public/assets/filesFinal2.csv")
  final = []
  print(int(len(df)/3))
  groups = [[3*i,3*i+1,3*i+2] for i in range(int(len(df)/3))]
  idx2bucket = {i : groups[i] for i in range(len(groups))}
  for i in range(len(df)):

    random_idx = random.choice(list(idx2bucket.keys()))
    
    bucket = idx2bucket[random_idx]
   
    first = bucket.pop(0)
    final += [first]
    if len(bucket) == 0:
    
      
      del idx2bucket[random_idx]

  df = df.iloc[final]

  df['ID'] = df.apply(lambda x: "".join(sorted([fn.split('.')[0] for fn in x])), axis = 1)

  print(df)
  return jsonify({"images": list(df.itertuples(index=False))})

@app.route("/checkRegistered", methods = ['POST'])
@cross_origin()
def checkRegistered():
  """ Returns boolean true if username already exists in the username column of the users table, otherwise false """
  form = request.get_json()
  username = form['username']
  with dbm(None) as db:
    resp = db.user_exists(username)
    print(resp)
    if resp != None:
      registered = True
      backgroundInfo = not (None in resp)
    else:
      registered = False
      backgroundInfo = False

  return jsonify({"isRegistered": registered, "backgroundInfo":backgroundInfo})

@app.route("/recoverVotes", methods = ['POST'])
@cross_origin()
def recoverVotes():
  """ Returns json formatted list of votes that user has already made in database {votes: list((chosen, other), ...)} """
  form = request.get_json()
  username = form['username']
  with dbm(None) as db:
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
  with dbm(None) as db:
    db.update_details(username, age, gender, country, region, ethnicity)
  return jsonify({"success": True})

@app.route("/submitVotes", methods = ['POST'])
@cross_origin()
def submitVotes():
  """ Adds record to votes table for each new vote the user has made """
  form = request.get_json()
  username = form['username']
  votes = form['votes']
  with dbm(username) as db:
    db.add_votes(username, votes)

  return jsonify({"success": True})


if __name__ == "__main__":
  app.run()