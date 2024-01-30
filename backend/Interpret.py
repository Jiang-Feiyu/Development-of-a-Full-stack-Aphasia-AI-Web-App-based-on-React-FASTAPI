def import_packages():
    # 标准库
    import sys
    import os
    import pathlib
    import pickle
    from datetime import datetime
    import wave
    from os import listdir
    from os.path import isfile, join
    from random import randint
    import re
    from random import randint

    # 第三方库
    import librosa
    import matplotlib.pyplot as plt
    import matplotlib.image as imgshow
    import numpy as np
    from scipy.io import wavfile
    from scipy.io.wavfile import write
    from IPython import display
    from colorama import Fore
    import numpy as np
    import concurrent.futures
    import soundfile as sf
    from scipy.signal import resample

    # TensorFlow 和 Keras
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    
    # HDF5
    import h5py

    # 返回需要的模块
    return sys, os, pathlib, pickle, datetime, wave, listdir, isfile, join, randint, re, librosa, plt, imgshow, np, wavfile, write, display, Fore, tf, load_model, h5py, concurrent, sf, resample

# 调用函数来导入所有包
sys, os, pathlib, pickle, datetime, wave, listdir, isfile, join, randint, re, librosa, plt, imgshow, np, wavfile, write, display, Fore, tf, load_model, h5py, concurrent, sf, resample = import_packages()

# 检验h5文件是否损坏
def check_hdf5_file(file_path):
    try:
        # 打开 HDF5 文件
        with h5py.File(file_path, 'r') as f:
            # 检查文件中是否包含模型的关键组或数据集
            # 你可以根据实际情况修改下面的检查条件
            if 'model_weights' in f.keys() or 'model_config' in f.keys():
                print("HDF5 文件有效，模型文件没有损坏。")
            else:
                print("HDF5 文件不包含模型数据，可能已损坏。")
    except Exception as e:
        print("加载 HDF5 文件时出现错误：", e)

# 检验pickle文件是否损坏    
def check_pickle_file(file_path):
    with open(file_path, 'rb') as fp:
        try:
            data = pickle.load(fp)
            print("Loaded pickle file successfully:", data)
            return data
        except Exception as e:
            print("Error loading pickle file:", e)
            return None

# 并发加载模型
def load_model_task(model_path):
    print("model loading from path:", model_path)
    return load_model(model_path)

# 并发加载数据
def load_pickle_file(pickle_path):
    with open(pickle_path, 'rb') as fp:
        return pickle.load(fp)

# 加载模型和数据
def load_models_and_pickles(model_paths, pickle_paths):
    # Load models
    with concurrent.futures.ThreadPoolExecutor() as executor:
        models = list(executor.map(load_model_task, model_paths))
    
    # Load pickles
    with concurrent.futures.ThreadPoolExecutor() as executor:
        pickle_data = list(executor.map(load_pickle_file, pickle_paths))
    
    return models, pickle_data

# A function to read an audio .wav file and shows the waveform
def showAudio(file_name, SHOW):
    waveform1 = []  # 初始化波形数组
    print("Speech_Recognition.py: showAudio() version March 10,2023 ")  # 打印版本信息
    audio_binary = tf.io.read_file(file_name)  # 读取音频文件的二进制数据
    audio, sampleR = tf.audio.decode_wav(audio_binary)  # 解码音频文件，并获取音频数据和采样率
    print("Speech_Recognition.py: showAudio() sampleR = ", sampleR)  # 打印采样率信息

    if (sampleR != 48000):  # 如果采样率不是48000（标准采样率）
        print("showAudio(): Conversion is needed. To start now.")  # 打印提示信息，需要进行转换
        yy, sr = sf.read(file_name)
        yy_resampled = resample(yy, int(len(yy) * (48000 / sr))) # 对音频数据进行采样率转换为48000Hz
        sf.write(file_name, yy_resampled, 48000)
        audio_binary = tf.io.read_file(file_name)  # 重新读取转换后的音频文件
        audio, sampleR = tf.audio.decode_wav(audio_binary)  # 解码转换后的音频文件
        print("showAudio(): Conversion is completed.")  # 打印转换完成的提示信息

    waveform2 = audio.numpy()  # 将音频数据转换为numpy数组
    if (waveform2.shape[1] == 1):  # 如果音频为单声道
        waveform1 = waveform2  # 直接将音频数据赋值给波形数组
    else:  # 如果音频为立体声
        waveform1 = waveform2[:, 1]  # 取出立体声音频中的右声道，转换为单声道
        
    if SHOW:  # 如果需要显示波形图
        plt.figure(figsize=(25, 15), dpi=40)  # 设置图像大小和分辨率
        plt.plot(waveform1)  # 绘制波形图
        plt.xlabel('Sample')  # 设置x轴标签
        plt.ylabel('Amplitude')  # 设置y轴标签
        plt.title('Waveform')  # 设置图像标题
        plt.show()  # 显示图像
    
    return waveform1  # 返回处理后的波形数据数组

# 主函数 - 文字化输入内容
def execute_interpret(user_id: str, file_index: int, model_id: int):
    print("Speech_Recognition: execute_interpret()...",f"user_id = { user_id }",f"file_index = { file_index }",f"model_chosen = { model_id }")
    
    if model_id == 1: 
        model_paths = [
            './models/Models-LHo-20230111/cnn_yang1.h5',
            './models/Models-LHo-20230111/model6n.h5'
        ]
        pickle_paths = [
            './models/Models-LHo-20230111/saveDBindex',
            './models/Models-LHo-20230111/saveDBindex1',
            './models/Models-LHo-20230111/saveDBprob',
            './models/Models-LHo-20230111/saveDBprob1',
            './models/Models-LHo-20230111/saveDBwordID',
            './models/Models-LHo-20230111/saveDBwordID1'
        ]
    elif model_id == 2:
        model_paths = [
            './models/Models-P1-20230207/cnn_yang1.h5',
            './models/Models-P1-20230207/model6n.h5'
        ]
        pickle_paths = [
            './models/Models-P1-20230207/saveDBindex',
            './models/Models-P1-20230207/saveDBindex1',
            './models/Models-P1-20230207/saveDBprob',
            './models/Models-P1-20230207/saveDBprob1',
            './models/Models-P1-20230207/saveDBwordID',
            './models/Models-P1-20230207/saveDBwordID1'
        ]
    elif model_id == 3:
        model_paths = [
            './models/Models-P2-20230207/cnn_yang1.h5',
            './models/Models-P2-20230207/model6n.h5'
        ]
        pickle_paths = [
            './models/Models-P2-20230207/saveDBindex',
            './models/Models-P2-20230207/saveDBindex1',
            './models/Models-P2-20230207/saveDBprob',
            './models/Models-P2-20230207/saveDBprob1',
            './models/Models-P2-20230207/saveDBwordID',
            './models/Models-P2-20230207/saveDBwordID1'
        ]
    
    # Load models and pickles
    models, pickle_data = load_models_and_pickles(model_paths, pickle_paths)

# 主函数测试入口
# execute_interpret("ABC@abc.com", 1, 3)

# 函数调试
file_name = "./Data/2.wav"
waveform_data = showAudio(file_name, True)  # 将波形图显示出来