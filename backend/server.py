import os
import logging

import dto
import api
import misc

from fastapi import (
    HTTPException, UploadFile, FastAPI,
    WebSocket
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=["*"],
)

api.setup()

@app.get("/checkhealth")
def checkhealth():
    return { "status": "ok" }

@app.post("/user/register")
def register(rq: dto.register):
    ok, error = api.register(rq.username, rq.password)
    if not ok:
        raise HTTPException(status_code=400, detail=error)
    return dto.token(token = misc.tokenize(rq.username, rq.password))

@app.post("/user/login")
def login(rq: dto.login):
    ok, error = api.login(rq.username, rq.password)
    if not ok:
        raise HTTPException(status_code=400, detail=error)
    return dto.token(token = misc.tokenize(rq.username, rq.password))

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