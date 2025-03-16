import secrets
from flask import jsonify

# Variables
CAPTCHA_LENGTH = 12

valid_alphabet = [chr(i) for i in range(33, 127)]

# Generates captcha
def generate_captcha() -> str:
    return ''.join(secrets.choice(valid_alphabet) for i in range(0, CAPTCHA_LENGTH))

# Check whether captcha is right or wrong
def check_captcha(input_captcha, grab_captcha):
    if input_captcha == grab_captcha:
        print("INPUT_CAPTCHA:", input_captcha, "GRAB CAPTCHA:", grab_captcha)
        return jsonify({"success": True})
    else:
        print("INPUT_CAPTCHA:", input_captcha, "GRAB CAPTCHA:", grab_captcha)
        return jsonify({"success": False})
