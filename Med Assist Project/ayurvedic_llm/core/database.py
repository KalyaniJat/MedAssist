import sqlite3
from .config import DB_PATH

def bootstrap_demo_db():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.execute("""CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        name TEXT, age INTEGER, sex TEXT,
        primary_complaint TEXT,
        known_conditions TEXT
    )""")

    cur.execute("""CREATE TABLE IF NOT EXISTS allergies(
        user_id INTEGER,
        substance TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )""")

    cur.execute("""CREATE TABLE IF NOT EXISTS conversations(
        user_id INTEGER,
        role TEXT,              -- 'user' or 'doctor' or 'assistant'
        message TEXT,
        ts TEXT DEFAULT (datetime('now'))
    )""")

    # Seed
    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] == 0:
        cur.execute(
            "INSERT INTO users (id,name,age,sex,primary_complaint,known_conditions) "
            "VALUES (1,'Asha',34,'F','Recurrent acidity and bloating','mild_anxiety')"
        )
        cur.executemany("INSERT INTO allergies (user_id, substance) VALUES (?,?)",
                        [(1, "ginger"), (1, "sesame")])
        cur.executemany("INSERT INTO conversations (user_id, role, message) VALUES (?,?,?)", [
            (1, "user",   "I get burning sensation after spicy foods."),
            (1, "doctor", "Try to avoid late dinners and reduce chilies."),
            (1, "user",   "Sleep is irregular these days; lots of stress.")
        ])

    con.commit()
    con.close()

# Run on import
bootstrap_demo_db()
