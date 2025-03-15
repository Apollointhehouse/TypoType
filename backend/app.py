from flask import Flask, request

import db
from User import User

app = Flask(__name__)

db.setup_db()

@app.route("/")
def hello_world() -> str:
    return "<p>Hello, World!</p>"

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
