import sqlite3

def setup_db():
    try:
        con = sqlite3.connect("data.db")

        cur = con.cursor()

        cur.execute("CREATE TABLE user(id, name)")
        cur.execute("CREATE TABLE score(id, value, timestamp)")
    except:
        print("Failed to setup database!")


