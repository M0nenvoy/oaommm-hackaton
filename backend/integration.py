import json
import requests
import logging

import config

logger = logging.getLogger(__name__)

def process_message(username, history: list):
    history.insert(0, { "role": "system", "text": config.AI_FIRST_MESSAGE })
    data = {
        "messages": history,
        "username": username
    }
    response = requests.post(config.AI_ANSWER, json=data)
    return response

def upload(username: str, filepaths: list[str]):
    data = {
        "msg": filepaths,
        "username": username
    }
    requests.post(config.AI_UPLOAD, json=data)