import json

FILENAME = "login.json"

with open(FILENAME, "r") as f:
    LOGIN_KWARGS = json.load(f)
