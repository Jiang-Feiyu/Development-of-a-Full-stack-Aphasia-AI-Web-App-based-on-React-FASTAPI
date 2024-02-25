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
from pydub import AudioSegment
from starlette.responses import JSONResponse
from VoiceDetectionEngin import *

app = FastAPI()

inter_dict = {'0':'我', '1':'要','2':'去', '3':'廁', '4':'所', '5':'返','6':'睡','7':'房', '8':'書', '9':'廚',
              'A':'刷', 'B':'牙','C':'洗', 'D':'面', 'E':'開', 'F':'電','G':'腦','H':'閂', 'I':'燈', 'J':'出',
              'K':'客', 'L':'廳','M':'睇', 'N':'視', 'O':'叫', 'P':'人','Q':'鐘','R':'想', 'S':'上', 'T':'床',
              'U':'落', 'V':'攞','W':'手', 'X':'機', 'Y':'畀', 'Z':'話',
              '!':'你', ',':'飲','+':'茶', '(':'唔', ')':'水', '$':'吃','%':'面','#':'飯', '@':'早'
              }

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
    
    response = await call_next(request)
    
    logger.info(f"Sent response: {response.status_code}")
    logger.info(f"Response headers: {response.headers}")

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

    # write users' data into JSON file
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
    # 请你修改这个路由
    existing_user = next((u for u in users_db if u["usn"] == user.usn), None)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    users_db.remove(existing_user)

    # 将更新后的用户数据写入 JSON 文件
    with open("users.json", "w") as file:
        json.dump(users_db, file, indent=2)

    return {"message": "User deleted successfully"}

# Maintain a counter to generate sequential file names
file_counter = 1

# Function to find the next available file number
def find_next_available_number(directory):
    file_names = os.listdir(directory)
    file_numbers = [int(name.split(".")[0]) for name in file_names if name.endswith(".wav") and name.split(".")[0].isdigit()]
    if file_numbers:
        return max(file_numbers) + 1
    else:
        return 1

# 拖拽/上传文件
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Specify the path where you want to save the uploaded files
        save_path = "./Data"

        # Create the path if it doesn't exist
        os.makedirs(save_path, exist_ok=True)

        # Find the next available file number
        file_counter = find_next_available_number(save_path)

        # Generate the file name with sequential numbering
        file_name = f"{file_counter}.wav"
        file_path = os.path.join(save_path, file_name)

        # Save the file to the specified path
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Convert the file to WAV format
        audio = AudioSegment.from_file(file_path, format=file.filename.split('.')[-1])
        audio.export(file_path, format="wav")
        
        print("file_counter", file_counter)
        
        # Process the uploaded file
        # For now, we will just return the file details
        AIanswer = InterpretAI(file_counter)
        print('APIHost AIanswer (interpret) = ',AIanswer)
    
        return {"answer": AIanswer}
    except Exception as e:
        # 使用日志记录详细的错误信息
        logging.error("An error occurred while uploading the file:", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while uploading the file. Please check the server logs for more details.")

# 修改密码路由
@app.post("/change-password")
def change_password(user: User):
    existing_user = next((u for u in users_db if u["usn"] == user.usn), None)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 更新用户密码
    existing_user["pwd"] = user.pwd

    # 将更新后的用户数据写入 JSON 文件
    with open("users.json", "w") as file:
        json.dump(users_db, file, indent=2)

    return {"message": "Password changed successfully"}

# 前端录制文件

# 翻译音频
def InterpretAI(audio_id: int):
    print("audio_id", audio_id)
    AIanswer = run_interpret_audio(audio_id)
    if AIanswer == "...":
        return "Parsing failed"
    elif AIanswer == None:
        return "Upload failed"
    else:
        decoded_string = ''
        for char in AIanswer:
            if char in inter_dict:
                decoded_string += inter_dict[char]
        return decoded_string