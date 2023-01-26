from flask import Flask
import psycopg2

app = Flask(__name__)

@app.route("/")
def hello():
  return "Hello World!"

@app.route("/test")
def test:
  return "Testing"

if __name__ == "__main__":
  app.run()