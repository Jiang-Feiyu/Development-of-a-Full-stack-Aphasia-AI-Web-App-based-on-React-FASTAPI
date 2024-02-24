from datetime import datetime
import base64
from Request.MessagePostRequest import MessagePostRequest
from os import listdir
from os.path import isfile, join

from Utility.ServerSettings import ServerSettings

import time
import io
from Speech_Recognition import *
from pydub import AudioSegment

"""
The major use of VoiceDetectionEngine is to handle logics that process in the API.  

For example, get all audio file names, save audio are not related to the networking issue, 
so we can separate them.   

In case the function changes,  we need not to change the API - the API is the same, what changes is
just the process inside each function.  

In future, if we need to rewrite functions like save_audio, we only changes this file, instead of changing
in the API.
"""

def run_interpret_audio(user_id: int):
    print("VoiceDetectionEngine.py: run_interpret_audio()")

    # file_index is default 0 for online case
    file_index = 0 

    AIanswer = execute_interpret(user_id,file_index,111)
    return AIanswer