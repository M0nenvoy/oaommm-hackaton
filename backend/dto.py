from pydantic import BaseModel
from fastapi import UploadFile

class token(BaseModel):
    token: str

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
    username: str

class upload(BaseModel):
    token: str
    files: list[UploadFile]