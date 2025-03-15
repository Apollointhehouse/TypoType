import sqlite3

from flask import Flask, request, Response
import db
import os
import secrets
import json

from keymap import get_keymap

app = Flask(__name__)

con = sqlite3.connect("data.db", check_same_thread=False)
cur = con.cursor()
db.setup_db(con, cur)

@app.route("/api/prompts", methods=["GET"])
def get_random_prompt():
    files = os.listdir('prompts')
    file = secrets.choice(files)
    with open(f'prompts/{file}', 'r') as f:
        output = f.read()
    return Response(output, status=200)

@app.route("/api/keymaps", methods=["GET"])
def get_keymap():
    keymap = get_keymap()
    return Response(json.dumps(keymap), status=200)

@app.route("/api/scores", methods=["POST"])
def post_score():
    try:
        data = request.get_json()

        res = cur.execute(f"INSERT INTO scores (id, score) values ({data.get('id')}, {data.get('score')})")
        con.commit()
    except Exception as e:
        print(e)
    return Response(json.dumps(data), status=201)


@app.route("/api/scores", methods=["GET"])
def get_highscores():
    cur.execute("SELECT * FROM scores")
    all_records = cur.fetchall()
    return Response(json.dumps(all_records), status=201)

@app.post("/api/users")
def create_user():
    try:
        data = request.get_json()

        res = cur.execute(f"INSERT INTO users (name) values ({data.get('name')})")
        con.commit()

        data['id'] = cur.lastrowid
        return Response(json.dumps(data), status=201)

    except Exception as e:
        print(e)
    return Response(status=500)

