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

@app.route("/prompt", methods=["GET"])
def get_random_prompt():
    files = os.listdir('prompts')
    file = secrets.choice(files)
    with open(f'prompts/{file}', 'r') as f:
        output = f.read()
    return Response(output, status=200)

@app.route("/keymap", methods=["GET"])
def gen_keymap():
    keymap = get_keymap()
    return Response(json.dumps(keymap), status=200)

@app.route("/api")
def api_docs() -> str:
    return "Nothing Yet!"


@app.get("/api/img_gen/")
def prompt() -> str:
    return "foo"


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
