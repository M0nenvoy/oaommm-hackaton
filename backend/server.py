import os
import logging
import uuid

from typing import Annotated

import dto
import api
import misc
import auth

from fastapi import (
    HTTPException, UploadFile, FastAPI,
    WebSocket, Depends
)
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# -------- SETUP ---------- #
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

# -------- MISC ---------- #
@app.get("/checkhealth")
def checkhealth():
    return { "status": "ok" }

# -------- AUTH ---------- #
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        return auth.get_username(token)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/register")
def register(fd: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        api.register(fd.username, fd.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return dto.token(access_token=auth.make(fd.username), token_type="bearer")

@app.post("/token")
def login(fd: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        api.credentials_validate(fd.username, fd.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return dto.token(access_token=auth.make(fd.username), token_type="bearer")

# -------- USER ---------- #
@app.get("/user")
def user(username: Annotated[str, Depends(get_current_user)]):
    return { "username": username }

# -------- DOCS ---------- #
@app.post("/user/upload")
async def upload(files: list[UploadFile], username: Annotated[str, Depends(get_current_user)]):
    ok, error = await api.upload(username, files)
    if not ok:
        raise HTTPException(status_code=400, detail=error)

# -------- HISTORY ------ #
@app.post("/user/history")
async def history(rq: dto.history, username: Annotated[str, Depends(get_current_user)]):
    return api.get_messages_from_history(username, rq.id)

@app.get("/user/history")
async def historylast(username: Annotated[str, Depends(get_current_user)]):
    return [api.get_last_message_from_history(username=username, entry=x) for x in api.get_history_entries(username)]

@app.post("/user/newchat")
async def newchat(username: Annotated[str, Depends(get_current_user)]):
    chatId = uuid.uuid4()
    api.chat_make(username, str(chatId))
    return { "id": chatId }
    
# -------- CHAT ------ #
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json()
        try:
            assert data["msg"]
            assert data["chat_id"]
            assert data["access_token"]
        except Exception:
            logger.error("Сообщение должно содержать 'chat_id', 'msg' и 'access_token'")
            continue
        try:
            username = await get_current_user(data["access_token"])
        except HTTPException as e:
            logger.error("Ошибка в сокете: " + e.detail)
        response = api.process_message(dto.message_rq(
            chat_id = data["chat_id"],
            msg = data["msg"],
            username = username
        ))
        await websocket.send_json({
            "msg": response
        })