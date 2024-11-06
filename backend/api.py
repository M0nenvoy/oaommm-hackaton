import os
import json
import config
import logging

logger = logging.getLogger(__name__)

from datetime import date
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

def process_message(msg: str, username: str):
    return msg

def add_message_to_history(msg: str, username: str):
    userpath = f"{config.USERS}/{username}"
    if not os.path.isdir(userpath):
        raise Exception(f"Пользователя с ником {username} нет")
    if not os.path.isdir(f"{userpath}/{config.HISTORY_DIR}"):
        os.makedirs(f"{userpath}/{config.HISTORY_DIR}")
    with open(f"{userpath}/{config.HISTORY_DIR}/{config.HISTORY_FILE}", "w+", encoding='utf-8') as hfd:
        try:
            history = json.loads(hfd.read())
        except json.decoder.JSONDecodeError:
            history = []
        if not isinstance(history, list):
            hfd.write("[]")
            return
        history.append({
            "msg": msg,
            "date": str(date.today())
        })
        hfd.seek(0)
        hfd.write(json.dumps(history, ensure_ascii=False))
        hfd.truncate()

def get_messages_from_history(username: str):
    with open(f"{config.USERS}/{username}/{config.HISTORY_DIR}/{config.HISTORY_FILE}", "r", encoding='utf-8') as hfd:
        return json.loads(hfd.read())