from flask import Flask, request, Response
import db
import os
import secrets
import json
import sqlite3
from datetime import datetime

from User import User
from keymap import generate_keymap
from captcha import generate_captcha
from captcha import check_captcha
from User import User, createUser, getUser
from keymap import get_keymap


app = Flask(__name__)


db.setup_db()

con = sqlite3.connect("data.db", check_same_thread=False)
cur = con.cursor()
db.setup_db(con, cur)


# Data
@app.route("/prompts", methods=["GET"])
def get_random_prompt():
    files = os.listdir('prompts')
    file = secrets.choice(files)
    with open(f'prompts/{file}', 'r') as f:
        output = f.read()
    return Response(output, status=200)

@app.route("/keymaps", methods=["GET"])
def get_keymap():
    keymap = generate_keymap()
    return Response(json.dumps(keymap), status=200)

@app.route("/scores", methods=["POST"])
def post_score():
    try:
        data = request.get_json()

        res = cur.execute(f"INSERT INTO scores (id, score) values ({data.get('id')}, {data.get('score')})")
        con.commit()
        
        data['id'] = cur.lastrowid

    except Exception as e:
        print(e)
    return Response(json.dumps(data), status=201)


@app.route("/highscores", methods=["GET"])
def get_highscores():
    cur.execute("SELECT * FROM scores")
    all_records = cur.fetchall()
    return Response(json.dumps(all_records), status=201)


# Captcha
@app.route("/captcha", methods=["POST"])
def get_captcha():
    return Response(generate_captcha, status=201)

@app.route("/captcha", methods=["GET"])
def verify_captcha(input_captcha):
    return check_captcha(input_captcha)
