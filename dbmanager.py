import psycopg2
import datetime
from psycopg2.pool import ThreadedConnectionPool as _ThreadedConnectionPool
from threading import Semaphore, Lock
from login import LOGIN_KWARGS

class ThreadedConnectionPool(_ThreadedConnectionPool):
    """" 
    Threaded connection pool class: Wrapper around psycopg2.pool.ThreadedConnectionPool class\n
    Implements semaphore to prevent connection exhuastion errors\n
    Implements locks around keyed connections to prevent multiple threads from acquiring the same connection with key
    """
    def __init__(self, minconn, maxconn, *args, **kwargs):
        """" 
        minconn: minimum number of connections that will be available
        maxconn: maximum number of connections that will be available
        """
        self._semaphore = Semaphore(maxconn)
        self._key_lock = Lock()
        self._key_locks = {}
        super().__init__(minconn, maxconn, *args, **kwargs)

    def getconn(self, key = None):
        """
        key: (optional) if key is not None the connection associated with the key will be returned\n
        Acquire a connection from the pool and return it\n
        If key is provided, block access to the connection by other threads till the connection is put back in the pool
        """
        self._semaphore.acquire()
        
        if key is not None:
            self._key_lock.acquire()
            print(str(key), "blocking keyed connection access")
            try:
                if key in self._key_locks:
                    self._key_locks[key].acquire()
                    print(str(key), "connection lock acquired")
                else:
                    lock = Lock()
                    lock.acquire()
                    self._key_locks[key] = lock
                    print(str(key), "connection lock acquired")
            finally:
                self._key_lock.release()
                print(str(key), "no longer blocking keyed connection access")
        try:
            return super().getconn(key)
        except:
            self._semaphore.release()
            if key is not None:
                self._key_locks[key].release()
                print(str(key), "connection lock released")
            raise

    def putconn(self, conn = None, key = None, close = False):
        """
        conn: the connection to be put back in the pool
        key: (optional) if key is not None the connection will be put back in the pool with association to the given key, this should use the same key that was previously used with getconn()
        close: (optional) if True the connection will be closed when put back in the pool
        Returns the connection to the pool
        """
        try:
            super().putconn(conn, key, close)
        finally:
            self._semaphore.release()
            if key is not None:
                self._key_locks[key].release()
                print(str(key), "connection lock released")

class DbManager:
    pool = ThreadedConnectionPool(1, 20, **LOGIN_KWARGS)

    def __init__(self, source):
        self.source = source
        self.conn = self.pool.getconn(key = source)
        print(str(self.source), " connected")
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self

    def __exit__(self, exc_class, exc, traceback):
        self.conn.commit()
        self.cursor.close()
        self.pool.putconn(self.conn, key = self.source)
        print(str(self.source), "disconnected")

    def add_vote(self, username, chosen_image_filename, other_image_filename):
        """ Adds vote to database """
        self.cursor.execute("INSERT INTO votes(username, chosen_image_filename, other_image_filename, timestamp) VALUES(%s,%s,%s,%s) ON conflict (username, chosen_image_filename, other_image_filename) do nothing",\
            (username, chosen_image_filename, other_image_filename, datetime.datetime.now()))
        self.conn.commit()
        
    def add_votes(self, username, votes):
        """ 
        Adds batch of votes to database with executemany 

        """
        time = datetime.datetime.now()
        data = [{'username':username, 'chosen_image_filename':vote[0], 'other_image_filename':vote[1], 'timestamp':time} for vote in votes]
        self.cursor.executemany("""
            UPDATE votes SET chosen_image_filename=%(chosen_image_filename)s, other_image_filename=%(other_image_filename)s, timestamp=%(timestamp)s 
            WHERE username=%(username)s AND chosen_image_filename=%(other_image_filename)s AND other_image_filename=%(chosen_image_filename)s;
            INSERT INTO votes(username, chosen_image_filename, other_image_filename, timestamp) VALUES (%(username)s, %(chosen_image_filename)s, %(other_image_filename)s, %(timestamp)s)
            ON conflict (username, chosen_image_filename, other_image_filename) do nothing;
            """,\
            data)
        self.conn.commit()

    def remove_vote(self, username, chosen_image_filename, other_image_filename):
        """ Removes vote from database"""
        self.cursor.execute("DELETE FROM votes WHERE username=%s AND chosen_image_filename=%s AND other_image_filename=%s",\
            (username, chosen_image_filename, other_image_filename))
        self.conn.commit()

    def get_votes(self, username):
        """ Retrieves pairs of (chosen image, other image) from votes user has made """
        self.cursor.execute("SELECT chosen_image_filename, other_image_filename FROM votes WHERE username=%s",\
            (username, ))
        return self.cursor.fetchall()

    def vote_exists(self, username, chosen_image_filename, other_image_filename):
        """ Returns true if user has made a specific vote pairing """
        self.cursor.execute("SELECT 1 FROM votes WHERE username=%s AND chosen_image_filename=%s AND other_image_filename=%s LIMIT 1",\
            (username, chosen_image_filename, other_image_filename))
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
       

