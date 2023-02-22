import psycopg2
import pandas as pd
import datetime

from login import LOGIN_KWARGS

def get_cols(cur):
    cur.execute("select column_name from information_schema.columns where table_name='votes' order by table_name, ordinal_position")
    return [x for (x,) in cur.fetchall()]

def get_vote_df(cur):
    cur.execute("select * from votes")
    votes = cur.fetchall()
    cols = get_cols(cur)
    data = []
    for vote in votes:
        assert len(vote) == len(cols)
        res = {}
        for name, val in zip(cols, vote):
            res[name] = val
        data.append(res)
    return pd.DataFrame(data)

with psycopg2.connect(**LOGIN_KWARGS) as conn2:
    with conn2.cursor() as cur2:
        votes = get_vote_df(cur2)

if __name__ == "__main__":
    print(votes)
