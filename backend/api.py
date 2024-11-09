import os
import json
import config
import logging

import db
import dto
import requests

logger = logging.getLogger(__name__)

from datetime import date
from fastapi import UploadFile

def setup():
    db.setup()

def register(username: str, password: str):
    if not db.user_dir_exists(username):
        db.user_dir_make(username)
    db.user_password_set(username, password)
    db.user_history_dir_make(username)

def credentials_validate(username: str, password: str) -> bool:
    if not db.user_dir_exists(username):
        raise Exception("Пользователь не существует")
    if db.user_password_get(username) != password:
        raise Exception("Неверный пароль")

async def upload(username: str, password: str, files: list[UploadFile]):
    userpath = "{users}/{username}".format(users=config.USERS_DIR, username=username)
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


def add_message_to_history(username: str, entry: str, msg: str):
    history = []
    if db.user_history_entry_exists(username, entry):
        history = json.loads(db.user_history_entry_get(username, entry))
    history.append({
        "who": username,
        "msg": msg,
        "date": str(date.today())
    })
    db.user_history_entry_set(username, entry, json.dumps(history, ensure_ascii=False))

def chat_make(username: str, entry: str):
    if db.user_history_entry_exists(username, entry):
        return
    db.user_history_entry_set(username, entry, '[]')

def get_history_entries(username):
    return db.user_history_entry_ls(username)

def get_messages_from_history(username: str, entry: str):
    if not db.user_history_entry_exists(username, entry):
        raise Exception("История не существует")
    return db.user_history_entry_get(username, entry)

def get_last_message_from_history(username: str, entry: str):
    if not db.user_history_entry_exists(username, entry):
        raise Exception("История не существует")
    try:
        messages = json.loads(db.user_history_entry_get(username, entry))
        if len(messages) == 0:
            return { 'id': entry }
        last = messages[-1]
        last['id'] = entry
        return last
    except Exception as e:
        raise Exception("Файл истории испорчен")
    

def process_message(message: dto.message_rq):
    add_message_to_history(
        username=message.username,
        entry=message.chat_id,
        msg=message.msg
    )
    data = {"messages": [
        {
            "role": "system",
            "text": "Ты — умный ассистент."
        },
        {
            "role": "user",
            "text": message.msg
        }
    ],
"username": "alexsneg"}
    response = requests.post("http://localhost:8080/answer", json=data)
    print(response.json())
    return response.json()