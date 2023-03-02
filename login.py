"""
Utility code to read database connection details from login.json.
"""

import json

FILENAME = "login.json"

with open(FILENAME, "r") as f:
    LOGIN_KWARGS = json.load(f)
