import psycopg2
import datetime

from login import LOGIN_KWARGS
class DbManager:
    def __init__(self):
        self.conn = psycopg2.connect(**LOGIN_KWARGS)
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self

    def __exit__(self, exc_class, exc, traceback):
        self.conn.commit()
        self.conn.close()

    def add_vote(self, username, chosen_image_filename, combination_id):
        """ Adds vote to database """
        self.cursor.execute("INSERT INTO votes(username, chosen_image_filename, combination_id, timestamp) VALUES(%s,%s,%s,%s) ON conflict (username, combination_id) do nothing",\
            (username, chosen_image_filename, combination_id, datetime.datetime.now()))
        self.conn.commit()
        
    def add_votes(self, username, votes):
        """ 
        Adds batch of votes to database with executemany 

        """

        time = datetime.datetime.now()
        data = [{'username':username, 'chosen_image_filename':vote['chosenImage'], 'combination_id':vote['combinationID'], 'timestamp':time} for vote in votes]
        print(data)
        self.cursor.executemany("""
            UPDATE votes SET chosen_image_filename=%(chosen_image_filename)s, timestamp=%(timestamp)s 
            WHERE username=%(username)s AND combination_id=%(combination_id)s;
            INSERT INTO votes(username, chosen_image_filename, combination_id, timestamp) VALUES (%(username)s, %(chosen_image_filename)s, %(combination_id)s, %(timestamp)s)
            ON conflict (username, combination_id) do nothing;
            """,\
            data)

    def remove_vote(self, username, combination_id):
        """ Removes vote from database"""
        self.cursor.execute("DELETE FROM votes WHERE username=%s AND combination_id=%s",\
            (username, combination_id))
        self.conn.commit()

    def get_votes(self, username):
        """ Retrieves pairs of (chosen image, other image) from votes user has made """
        self.cursor.execute("SELECT chosen_image_filename, combination_id FROM votes WHERE username=%s",\
            (username, ))
        return self.cursor.fetchall()

    def vote_exists(self, username, combination_id):
        """ Returns true if user has made a specific vote pairing """
        self.cursor.execute("SELECT 1 FROM votes WHERE username=%s AND combination_id=%s LIMIT 1",\
            (username, combination_id))
        return self.cursor.fetchone() != None

    def count_votes(self, username):
        """ Returns amount of votes user has made """
        self.cursor.execute("count(username) FROM votes WHERE username=%s", \
            (username, ))
        return self.cursor.fetchone()[0]

    def add_user(self, username, age, gender, country, region, ethnicity):
        """ Adds user to database """
        self.cursor.execute("INSERT INTO users(username, age, gender, country, region, ethnicity) VALUES(%s, %s, %s)",\
            (username, age, gender))
        self.conn.commit()
    
    def user_exists(self, username):
        """ Checks if user already exists in database """
        self.cursor.execute("SELECT age, gender, country, region, ethnicity FROM users WHERE username=%s LIMIT 1", (username, ))
        return self.cursor.fetchone()
    
    def update_details(self, username, age, gender, country, region, ethnicity):
        """ Update record on  """

        self.cursor.execute("UPDATE users SET age=%s, gender = %s, country = %s, region = %s, ethnicity = %s WHERE username=%s",\
            (age, gender, country, region, ethnicity, username))
        sel.conn.commit()
       

