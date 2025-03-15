from flask import Flask, request, Response
import db
import os
import secrets
import json

from User import User
from keymap import get_keymap

app = Flask(__name__)

db.setup_db()

@app.route("/")
def hello_world() -> str:
    return "<p>Hello, World!</p>"

@app.route("/prompts", methods=["GET"])
def get_random_prompt():
    files = os.listdir('prompts')
    file = secrets.choice(files)
    with open(f'prompts/{file}', 'r') as f:
        output = f.read()
    return Response(output, status=200)

@app.route("/keymaps", methods=["GET"])
def get_keymap():
    keymap = get_keymap()
    return Response(json.dumps(keymap), status=200)

@app.route("/scores", methods=["POST"])
def post_score():
    return Response(request.get_json(), status=201)

@app.route("/highscores", methods=["GET"])
def get_highscores():
    return Response(json.dumps([{"name": 'Bob', "wpm":1}, {"name": 'Jack', "wpm":3}, {"name": 'Fern', "wpm":32}, {"name": 'Asley', "wpm":13}]), status=201)

# User
@app.post("/api/user/login")
def register(id, user):

    return

@app.post("/api/user/login")
def login(id, user):
    return

@app.post("/api/user")
def about():
    data = request.json
    id = data.get("id")

    user = User(id)

    return " ".join([user.name, user.score, user.timestamp])

# @app.get("/api/user")
