import os
import config
import logging

logger = logging.getLogger(__name__)

from fastapi import UploadFile

def setup():
    if not os.path.isdir(config.USERS):
        os.makedirs(config.USERS)

def register(username: str, password: str):
    userpath = "{users}/{username}".format(users=config.USERS, username=username)
    if os.path.isdir(userpath):
        return (False, "Пользователь уже существует")
    os.makedirs(f"{userpath}/{config.DOCS_DIR}")
    with open("{userpath}/{password}".format(userpath=userpath, password=config.PASSWORD_FILE), "w") as pfd:
        pfd.write(password)

    return (True, None)

def login(username: str, password: str):
    userpath = "{users}/{username}".format(users=config.USERS, username=username)
    if not os.path.isdir(userpath):
        return (False, "Пользователь не существует")
    with open("{userpath}/{password}".format(userpath=userpath, password=config.PASSWORD_FILE), "r") as pfd:
        if not password == pfd.read():
            return (False, "Неверный пароль")
    return (True, None)

async def upload(username: str, password: str, files: list[UploadFile]):
    userpath = "{users}/{username}".format(users=config.USERS, username=username)
    if not os.path.isdir(userpath):
        return (False, "Плохой токен")  
    with open("{userpath}/{password}".format(userpath=userpath, password=config.PASSWORD_FILE), "r") as pfd:
        if not password == pfd.read():
            return (False, "Плохой токен")
    for file in files:
        try:
            content = file.file.read()
            with open("{userpath}/{filename}".format(userpath=userpath, filename=file.filename), "wb") as f:
                f.write(content)
        except Exception as e:
            logger.warning(e)
            return (False, "Не удалось обработать 1 или более файлов")
        finally:
            await file.close()
    return (True, None)

async def process_message(msg: str):
    return str