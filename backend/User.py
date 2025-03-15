import db

class User:
    @property
    def name(self):
        return db.cur.execute(f"SELECT name FROM users WHERE id = {id}")

    def __init__(self, id, name = None):
        self.id = id
        self.score = 0
        self.timestamp = None

        db.cur.execute(f"INSERT INTO users values ({id}, {name})")
        db.cur.execute(f"INSERT INTO scores values ({id}, {score}, {timestamp})")
