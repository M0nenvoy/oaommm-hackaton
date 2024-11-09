from pydantic import BaseModel
from fastapi import UploadFile

class token(BaseModel):
    access_token: str
    token_type: str

class status(BaseModel):
    status: str
    msg: str

class register(BaseModel):
    username: str
    password: str

class login(BaseModel):
    username: str
    password: str

class history(BaseModel):
    id: str

class upload(BaseModel):
    token: str
    files: list[UploadFile]

class message_rq(BaseModel):
    chat_id: str
    msg: str
    username: str

class message(BaseModel):
    who: str
    msg: str
    date: str
