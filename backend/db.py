def setup_db(con, cur):
    try:
        # Create the users table with TEXT for name (SQLite doesn't require length for TEXT fields)
        cur.execute("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)")
        
        # Create the scores table with foreign key linking user_id to users table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS scores(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                score INTEGER,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)    
    except Exception as e:
        print("Failed to setup database!")
        print(e)


