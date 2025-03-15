from dataclasses import dataclass


@dataclass
class User:
    id: int
    name: str
    high_score: int

def getUser(cur, id):

    name = cur.execute(f"SELECT name FROM users WHERE id = {id}").fetchone()
    cur.execute(f"SELECT score, MAX(timestamp) FROM ")

    return User(id, name)

def createUser(cur, id, name):
    cur.execute(f"INSERT INTO users values ({id}, {name})")

    return User(id, name)