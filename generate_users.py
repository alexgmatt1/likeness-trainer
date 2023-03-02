"""
Run-once script to generate random user access codes and writes them to a database
"""

import random
import psycopg2

from login import LOGIN_KWARGS

assert False and "This script has already run. Do not run it again unless we desperately need more users. Also there's no code that deals with conflicts with existing access codes in the database."

def get_access_code():
    res = [str(random.randint(0, 9)) for _ in range(8)]
    return "".join(res)
    
s = set()

for _ in range(1000):
    c = get_access_code()
    while c in s:
        c = get_access_code()
    s.add(c)

ss = sorted(s)

with psycopg2.connect(**LOGIN_KWARGS) as conn2:
    with conn2.cursor() as cur2:
        cur2.executemany("INSERT INTO users(username) VALUES (%s)", [(x,) for x in ss])

    conn2.commit()

for x in ss:
    print(x)
