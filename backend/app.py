from flask import Flask, request, Response
from flask_cors import CORS 
import db
import os
import secrets
import json
import sqlite3
from keymap import generate_keymap
from captcha import generate_captcha, check_captcha

app = Flask(__name__)
CORS(app)

con = sqlite3.connect("data.db", check_same_thread=False)
cur = con.cursor()
db.setup_db(con, cur)

# Data
@app.route("/api/prompts", methods=["GET"])
def get_random_prompt():
    files = os.listdir('prompts')
    file = secrets.choice(files)
    with open(f'prompts/{file}', 'r') as f:
        output = f.read()
    return Response(json.dumps({"text":output}), status=200)

@app.route("/api/keymaps", methods=["GET"])
def get_keymap():
    keymap = generate_keymap()
    return Response(json.dumps(keymap), status=200)

@app.route("/api/scores", methods=["POST"])
def post_score():
    try:
        data = request.get_json()

        res = cur.execute("INSERT INTO scores (user_id, score) VALUES (?, ?)", (data.get('id'), data.get('score')))
        con.commit()
    except Exception as e:
        print(e)
    return Response(json.dumps(data), status=201)


@app.route("/api/scores", methods=["GET"])
def get_highscores():
    cur.execute("""
        SELECT scores.id, scores.user_id, scores.score, users.name 
        FROM scores
        JOIN users ON scores.user_id = users.id
        ORDER BY scores.score DESC
        LIMIT 20
    """)
    all_records = cur.fetchall()
    print(all_records)
    scores = [{"score": s[2], "name": s[3]} for s in all_records]
    return Response(json.dumps(scores), status=201)

# Users

@app.post("/api/users")
def create_user():
    try:
        data = request.get_json()

        res = cur.execute(f"INSERT INTO users (name) values (?)", (data.get('name'),))
        con.commit()

        data['id'] = cur.lastrowid
        return Response(json.dumps(data), status=201)

    except Exception as e:
        print(e)
    return Response(status=500)

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    try:
        # Fetch the user from the database
        cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cur.fetchone()

        if user:
            # Convert the user data to a dictionary
            user_data = {
                "id": user[0],
                "name": user[1]
            }
            return Response(json.dumps(user_data), status=200)
        else:
            return Response(json.dumps({"error": "User not found"}), status=404)
    except Exception as e:
        print(e)
        return Response(json.dumps({"error": "Internal server error"}), status=500)

@app.route("/api/users", methods=["GET"])
def get_users():
    try:
        # Fetch all users from the database
        cur.execute("SELECT * FROM users")
        users = cur.fetchall()

        if users:
            # Convert the user data to a list of dictionaries
            user_list = []
            for user in users:
                user_data = {
                    "id": user[0],
                    "name": user[1]
                }
                user_list.append(user_data)
            
            return Response(json.dumps(user_list), status=200)
        else:
            return Response(json.dumps({"error": "No users found"}), status=404)
    except Exception as e:
        print(e)
        return Response(json.dumps({"error": "Internal server error"}), status=500)


# Captcha
@app.route("/api/captcha", methods=["GET"])
def get_captcha():
    return Response(generate_captcha(), status=201)

@app.route("/api/captcha", methods=["POST"])
def verify_captcha():
    input_captcha = request.form.get("userAnswer")
    grab_captcha = request.form.get("captchaQuestion")
    return check_captcha(input_captcha, grab_captcha)
