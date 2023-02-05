from flask import Flask
import psycopg2
import pandas as pd
from flask import jsonify, request, render_template
from flask_cors import CORS, cross_origin
from dbmanager import DbManager as dbm

app = Flask(__name__)

@app.route("/")
def hello():
  with dbm() as db:
    db.cursor.execute("select column_name from information_schema.columns where table_name='users' order by table_name, ordinal_position")
    cols = db.cursor.fetchall()
  print(cols)
  return str(cols)

@app.route("/test")
def test():
  return "Testing"


@app.route("/getImages", methods = ['POST'])
@cross_origin()
def getImages():
  df = pd.read_csv("./frontend/public/assets/files.csv")
  print(df)
  return jsonify({"images": list(df.itertuples(index=False))})

@app.route("/checkRegistered", methods = ['POST'])
@cross_origin()
def checkRegistered():
  username = request.form['username']
  with dbm() as db:
    registered = db.user_exists(username)
  return registered

@app.route("/recoverVotes", methods = ['POST'])
@cross_origin()
def recoverVotes():
  username = request.form['username']
  with dbm() as db:
    votes = db.get_votes(username)
  return jsonify({"votes": list(votes)})

@app.route("/addUser", methods = ['POST'])
@cross_origin()
def addUserInfo():
  username = request.form['username']
  age = request.form['age']
  gender = request.form['gender']
  with dbm() as db:
    db.add_user(username, age, gender)
  return

@app.route("/submitVotes", methods = ['POST'])
@cross_origin()
def submitVotes():
  username = request.form['username']
  votes = request.form['votes']
  with dbm() as db:
    for vote in votes:
      db.add_vote(username, vote[0], vote[1])
  return


if __name__ == "__main__":
  app.run()