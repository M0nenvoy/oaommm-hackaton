import uuid

_tokens = dict()

def get_username(token: str):
    if not token in _tokens:
        raise Exception("Невалидный токен")
    return _tokens[token]

def make(username: str):
    token = str(uuid.uuid4())
    _tokens[token] = username
    return token


