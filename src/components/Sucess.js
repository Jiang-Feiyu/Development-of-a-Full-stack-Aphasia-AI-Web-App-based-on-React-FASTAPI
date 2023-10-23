// need ``
// 1，起初页面只有`选择档案`和`开始录制`的按钮，不显示音频播放条。 
// 2, 在选择档案并上传以后，会根据文件后缀名筛选音频文档，只支持MP3格式的上传，否则会显示“你上传的文件格式不支持，只支持MP3格式的文件”；或者点击开始录制以后，会出现一个闪烁的红色按钮，显示“Recording in progress”。
// 3，当上传的音频文件大于3MB时，显示“你的文件过大，请小于3MB” 
// 4，点击录制按钮开始录制后，会出现一个暂停按钮，点击暂停停止，再次点击可以继续录制，总录制时间不能超过30s 
// 5，在下面有一个“Submit”按钮，按钮首先会检查是否有提交，如果没有提交需要显示“请上传文件/录制音频“ 
// 6，在检查没问题后点击submit按钮，会显示上传成功，并出现播放进度条；此时，submit按钮变为“再次录制”。并回到提交之前状态。

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Sucess.css";
import backgroundImage from './Background.jpeg';
import Popup from './Popup';

function Sucess() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [audioUrl, setAudioUrl] = useState(''); // 用于存储上传的音频文件的URL
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    // Check if a file was selected
    if (!file) {
      setErrorMessage('Please select a file.');
    } else if (file.type !== 'audio/mpeg') {
      setErrorMessage('The file format is not supported. Please select an MP3 file.');
    } else if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('The file is too large. Please select a file smaller than 3MB.');
    } else {
      // File uploaded successfully, set the audio URL
      setAudioUrl(URL.createObjectURL(file));
      setSuccessMessage('File uploaded successfully.');
    }

    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const startRecording = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          setMediaRecorder(mediaRecorder);
          const audioChunks = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunks.push(e.data);
              console.log('Data received:', e.data);
            }
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
            console.log('Audio Blob created:', audioBlob);
            setAudioUrl(URL.createObjectURL(audioBlob));
            setSuccessMessage('Audio recorded successfully.');
          };

          mediaRecorder.start();
          setRecording(true);
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
        });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
    // Clean up the media recorder on unmount
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    };
  }, []);

  return (
    <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content-box">
        <h2 className="success-header">Login Success</h2>
        <h5>Only accept MP3 format files and the size should be less than 3MB</h5>
        <h3>Or</h3>
        <h5>You can record an audio</h5>
        <div className="file-upload">
          <label className="custom-file-upload">
            <input type="file" accept=".mp3" onChange={handleFileUpload} />
            Select File
          </label>
        </div>
        <div className="button-group">
          <button onClick={recording ? stopRecording : startRecording}>
            {recording ? 'Pause' : 'Record'}
          </button>
          {audioUrl && ( // Render audio player if audioUrl is available
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <Link to="/">
            <button className="logout-button">Log out</button>
          </Link>
        </div>
        {showPopup && (
          <Popup message={errorMessage || successMessage} onClose={closePopup} />
        )}
      </div>
    </div>
  );
}

export default Sucess;
