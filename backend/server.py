import os
import logging

from typing import Annotated

import dto
import api
import misc

from fastapi import (
    HTTPException, UploadFile, FastAPI,
    WebSocket, Depends
)
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.setup()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    username, _ = misc.detokenize(token)
    return username

@app.get("/checkhealth")
def checkhealth(token: Annotated[str, Depends(get_current_user)]):
    return { "status": "ok" }

@app.get("/user")
def user(username: Annotated[str, Depends(get_current_user)]):
    return { "username": username }

@app.post("/register")
def register(rq: dto.register):
    ok, error = api.register(rq.username, rq.password)
    if not ok:
        raise HTTPException(status_code=400, detail=error)
    return dto.token(token = misc.tokenize(rq.username, rq.password))

@app.post("/token")
def login(fd: Annotated[OAuth2PasswordRequestForm, Depends()]):
    ok, error = api.login(fd.username, fd.password)
    if not ok:
        raise HTTPException(status_code=400, detail=error)
    return dto.token(access_token=misc.tokenize(fd.username, fd.password), token_type="bearer")

@app.post("/user/upload")
async def upload(files: list[UploadFile], token: str):
    try:
        username, password = misc.detokenize(token)
    except Exception:
        raise HTTPException(status_code=400, detail="Плохой токен")
    ok, error = await api.upload(username, password, files)
    if not ok:
        raise HTTPException(status_code=400, detail=error)
    
@app.post("/user/history")
async def history(rq: dto.history):
    return api.get_messages_from_history(rq.username)
    
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json()
        try:
            assert data["msg"]
            assert data["username"]
        except Exception:
            logger.error("Сообщение должно содержать 'username' и 'msg'")
            continue
        response = api.process_message(data["username"], data["msg"])
        api.add_message_to_history(data["msg"], data["username"])
        await websocket.send_json({
            "msg": response
        })