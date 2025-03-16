def setup_db(con, cur):
    try:
        cur.execute("CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR)")
        cur.execute("CREATE TABLE scores(id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, score INT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))")
    except Exception as e:
        print("Failed to setup database!")
        print(e)


