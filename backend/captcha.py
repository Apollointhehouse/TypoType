import secrets
from flask import jsonify

# Variables
CAPTCHA_LENGTH = 12

valid_alphabet = [chr(i) for i in range(33, 127)]
captcha_string: str = ""

# Generates captcha
def generate_captcha() -> str:
    captcha_string = ''.join(secrets.choice(valid_alphabet) for i in range(0, CAPTCHA_LENGTH))
    return captcha_string

# Test captcha generation
print(generate_captcha(), captcha_string)

# Check whether captcha is right or wrong
def check_captcha(input_captcha) -> bool:
    #parsed_captcha = json.loads(input_captcha)
    
    if input_captcha == captcha_string:
        return jsonify(True)
    else:
        return jsonify(False)
