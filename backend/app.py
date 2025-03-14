from flask import Flask

import sqlite3

app = Flask(__name__)

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

@app.get("/api/user/{user}/about")
def about(user):
    return

# @app.get("/api/user")
