import os
import json
import config
import logging
import uuid
import requests

import db
import filemeta
import dto

logger = logging.getLogger(__name__)

from datetime import date
from fastapi import UploadFile

def setup():
    db.setup()
    filemeta.setup()

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

async def upload(username: str, type: str, files: list[UploadFile]):
    userpath = "{users}/{username}".format(users=config.USERS_DIR, username=username)
    if not os.path.isdir(userpath):
        raise Exception("Пользователь не существует")  
    for file in files:
        try:
            id = str(uuid.uuid4())
            db.user_save_doc(username, file, name=id)
            filemeta.add(filemeta.Filemeta(id=id, name=file.filename, owner=username, type=type))
        except Exception as e:
            logger.warning(e)
            raise Exception("Не удалось обработать 1 или более файлов: " + str(e))
        finally:
            await file.close()


def get_global_files():
    files = filemeta.get_files()
    files = list(filter(lambda x: x['type'] == "global", files))
    files = list(map(lambda x: { "id": x['id'], "name": x['name'] }, files))
    return files

def get_user_files(username: str):
    files = filemeta.get_files()
    files = list(filter(lambda x: x['type'] == "local" and x['owner'] == username, files))
    files = list(map(lambda x: { "id": x['id'], "name": x['name'] }, files))
    return files


def add_message_to_history(username: str, entry: str, msg: str):
    history = []
    if db.user_history_entry_exists(username, entry):
        history = json.loads(db.user_history_entry_get(username, entry))
    history.append({
        "role": "user",
        "text": msg,
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
    return "ok"
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
