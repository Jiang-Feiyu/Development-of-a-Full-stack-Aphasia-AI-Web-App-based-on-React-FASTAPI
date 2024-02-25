import React, { useState, useRef } from "react";
import "./Dialogue.css";

const Dialogue = ({ username }) => {
  const [dialogue, setDialogue] = useState([]);
  const dialogueRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioUrlRef = useRef(null); // 确保定义了 audioUrlRef

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);

          setDialogue([
            ...dialogue,
            { user: "User", message: "Start an Audio" },
            { user: "System", message: "Audio uploaded", fileUrl: audioUrl },
          ]);

          audioChunksRef.current = [];
        };

        mediaRecorderRef.current = mediaRecorder;

        // 检查录音是否已经开始
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
          mediaRecorderRef.current.start();
          console.log("Recording started successfully");
        } else {
          console.log("Failed to start recording");
        }
      })
      .catch((error) => {
        console.error("Error starting recording:", error);
      });
  };

  const stopRecording = () => {
    // 检查录音是否已经停止
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      console.log("Recording stopped successfully");
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.wav'); // 注意这里的 key 名称必须与后端接收的名称匹配

      fetch('http://localhost:8000/upload-audio', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => console.log('Audio uploaded:', data))
        .catch(error => console.error('Error uploading audio:', error));
    } else {
      console.log("No recording to stop");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dialogueRef.current.classList.add("drag-over");
  };

  const handleDragLeave = () => {
    dialogueRef.current.classList.remove("drag-over");
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    dialogueRef.current.classList.remove("drag-over");

    const file = e.dataTransfer.files[0];

    if (file && file.size <= 5 * 1024 * 1024) {
      uploadFile(file);
      setDialogue([
        ...dialogue,
        { user: "User", message: `Upload an Audio: ${file.name}` },
        { user: "System", message: `File dropped: ${file.name}` },
      ]);

    } else {
      console.log("File exceeds 5 MB size limit.");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size <= 5 * 1024 * 1024) {
      setDialogue([
        ...dialogue,
        { user: "User", message: `Upload an Audio` },
        { user: "System", message: `File upload: ${file.name}` },
      ]);

      // Upload the file to the backend
      uploadFile(file);
    } else {
      alert("File exceeds 5 MB size limit.");
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName || 'audio.wav';
    a.click();
    URL.revokeObjectURL(fileUrl);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setDialogue([
          ...dialogue,
          { user: "User", message: `File uploaded, Size: ${data.file_size} bytes` },
          { user: "System", message: `Parsing content: ${data.answer}` }, // 使用后端返回的消息
        ]);
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>Drag and drop your files in the Chatbox</h2>
      <div className="dialogue-wrapper">
        <div
          className="dialogue-container"
          ref={dialogueRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {dialogue.map((entry, index) => (
            <div key={index} className={`dialogue-entry ${entry.user.toLowerCase()}`}>
              <strong>{entry.user}:</strong> {entry.message}
              {entry.fileUrl && (
                <button onClick={() => handleDownload(entry.fileUrl, entry.message)}>Download</button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="button-group">
        <label className="file-upload-btn">
          <input type="file" onChange={handleFileInputChange} />
        </label>
        <button className="start-btn" onClick={startRecording}>Start</button>
        <button className="stop-btn" onClick={stopRecording}>Stop</button>
      </div>
    </div>
  );
};

export default Dialogue;