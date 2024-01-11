from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import json
import os
import logging
from fastapi import Request
import shutil

app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头部
)

# 添加 TrustedHostMiddleware，确保正确处理主机头
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

# 配置日志记录
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 添加请求和响应日志中间件
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log incoming requests and outgoing responses.
    """
    logger.info(f"Received request: {request.method} {request.url}")
    logger.info(f"Request headers: {request.headers}")
    # logger.info(f"Request body: {await request.body()}")
    
    response = await call_next(request)
    
    logger.info(f"Sent response: {response.status_code}")
    logger.info(f"Response headers: {response.headers}")
    # logger.info(f"Response body: {response.body}")

    return response

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

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Specify the path where you want to save the uploaded files
        save_path = "./Data"

        # Create the path if it doesn't exist
        os.makedirs(save_path, exist_ok=True)

        # Combine the save_path with the filename to get the full save path
        file_path = os.path.join(save_path, file.filename)

        # Save the file to the specified path
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Process the uploaded file
        # For now, we will just return the file details
        return {"filename": file.filename, "file_size": os.path.getsize(file_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))