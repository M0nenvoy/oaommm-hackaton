def tokenize(username: str, password: str):
    return "{username};{password}".format(username=username, password=password)

def detokenize(token: str):
    return token.split(";")