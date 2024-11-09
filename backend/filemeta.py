import os
import json
import uuid

import config

def setup():
    if not os.path.isdir(config.META_DIR):
        os.makedirs(config.META_DIR)
        with open(f"{config.META_DIR}/{config.META_FILE}", "w+", encoding='utf-8') as f:
            f.write("[]")


class Filemeta:
    name: str
    path: str
    type: str
    owner: str
    def __init__(self, id, name, owner, type):
        self.id = id
        self.name = name
        self.owner = owner
        self.type = type


    def toJSON(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'owner': self.owner
        }

def read():
    with open(f"{config.META_DIR}/{config.META_FILE}", 'r') as f:
        return f.read()

def write(data: str):
    with open(f"{config.META_DIR}/{config.META_FILE}", 'w+') as f:
        f.write(data)
    
def get_files() -> list[Filemeta]:
    return json.loads(read())

def add(file: Filemeta):
    files = get_files()
    assert isinstance(files, list)
    files.append(file.toJSON())
    write(json.dumps(files, ensure_ascii=False))