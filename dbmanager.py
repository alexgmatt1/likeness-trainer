import psycopg2
import datetime
class DbManager:
    def __init__(self):
        self.conn = psycopg2.connect(host="likenesstrainerdb.postgres.database.azure.com", dbname="postgres", user="alexgmatt1", password="azureROCKS!")
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self

    def __exit__(self, exc_class, exc, traceback):
        self.conn.commit()
        self.conn.close()

    def add_vote(self, username, voted_image, other_image):
        """ Adds vote to database """
        self.cursor.execute("INSERT INTO votes(username, voted_image, other_image, timestamp) VALUES(%s,%s,%s,%s)",\
            (username, voted_image, other_image, datetime.datetime()))

    def remove_vote(self, username, voted_image, other_image):
        """ Removes vote from database"""
        self.cursor.execute("DELETE FROM votes WHERE username=%s AND voted_image=%s AND other_image=%s",\
            (username, voted_image, other_image))

    def get_votes(self, username):
        """ Retrieves pairs of (chosen image, other image) from votes user has made """
        self.cursor.execute("SELECT voted_image, other_image FROM votes WHERE username=%s",\
            (username, ))
        return self.cursor.fetchall()

    def vote_exists(self, username, voted_image, other_image):
        """ Returns true if user has voted on specific pairing """
        self.cursor.execute("SELECT 1 FROM votes WHERE username=%s AND voted_image=%s AND other_image=%s LIMIT 1",\
            (username, voted_image, other_image))
        return (self.cursor.fetchone()[0] == 1)

    def count_votes(self, username):
        """ Returns amount of votes user has made """
        self.cursor.execute("count(username) FROM votes WHERE username=%s", \
            (username, ))
        return self.cursor.fetchone()[0]

    def add_user(self, username, age, gender):
        """ Adds user to database """
        self.cursor.execute("INSERT INTO users(username, age, gender) VALUES(%s, %s, %s)",\
            (username, age, gender))
    
    def user_exists(self, username):
        """ Checks if user already exists in database """
        self.cursor.execute("SELECT 1 FROM users WHERE username=%s LIMIT 1", (username, ))
        return (self.cursor.fetchone()[0] == 1)
    
    def update_details(self, username, age, gender):
        """"""
        self.cursor.execute("UPDATE users SET age=%s WHERE username=%s",\
            (age, username))
        self.cursor.execute("UPDATE users SET gender=%s WHERE username=%s",\
            (age, gender))
