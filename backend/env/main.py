from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头部
)

class User(BaseModel):
    usn: str
    pwd: Optional[str] = None

# 加载现有用户数据
try:
    with open("users.json", "r") as file:
        users_db = json.load(file)
except FileNotFoundError:
    users_db = []

@app.post("/register")
def register_user(user: User):
    existing_user = next((u for u in users_db if u["usn"] == user.usn), None)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    users_db.append({"usn": user.usn, "pwd": user.pwd})

    # 将用户数据写入 JSON 文件
    with open("users.json", "w") as file:
        json.dump(users_db, file, indent=2)

    return {"message": "User registered successfully"}

@app.post("/login")
def login_user(user: User):
    existing_user = next((u for u in users_db if u["usn"] == user.usn), None)
    if not existing_user or existing_user["pwd"] != user.pwd:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}

@app.post("/delete")
def delete_user(user: User):
    existing_user = next((u for u in users_db if u["usn"] == user.usn), None)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    users_db.remove(existing_user)

    # 将更新后的用户数据写入 JSON 文件
    with open("users.json", "w") as file:
        json.dump(users_db, file, indent=2)

    return {"message": "User deleted successfully"}