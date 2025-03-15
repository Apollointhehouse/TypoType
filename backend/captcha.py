import secrets

CAPTCHA_LENGTH = 12
valid_keys = [chr(i) for i in range(33, 127)]

def generate_captcha() -> str:
    return ''.join(secrets.choice(valid_keys) for i in range(0, CAPTCHA_LENGTH))

print(generate_captcha())
