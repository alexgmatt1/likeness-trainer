from flask import Flask
import psycopg2
import pandas as pd
from flask import jsonify,request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)

@app.route("/")
def hello():
  return "Hello World!"

@app.route("/test")
def test():
  return "Testing"


@app.route("/getImages", methods = ['POST'])
@cross_origin()
def getImages():
  df = pd.read_csv("./frontend/public/assets/files.csv")
  print(df)
  return jsonify({"images": list(df.itertuples(index=False))})


if __name__ == "__main__":
  app.run()