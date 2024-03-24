// Dialogue.js
import React, { useState, useRef } from "react";
import "./Dialogue.css";
import Record from './Record';

const Dialogue = ({ username }) => {
  const [dialogue, setDialogue] = useState([]);
  const dialogueRef = useRef(null);

  const updateDialogue = (message, user) => {
    setDialogue([...dialogue, { user, message }]);
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
      setDialogue([
        ...dialogue,
        { user: "User", message: `Upload an Audio: ${file.name}` },
        { user: "System", message: `File dropped: ${file.name}` },
      ]);
      // Upload the file to the backend
      uploadFile(file);
    } else {
      console.log("File exceeds 5 MB size limit.");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size <= 5 * 1024 * 1024) {
      setDialogue([
        ...dialogue,
        { user: "User", message: `Upload an Audio: ${file.name}` },
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
          { user: "User", message: `File uploaded: ${data.filename}, Size: ${data.file_size} bytes` },
          { user: "System", message: data.answer }, // 使用后端返回的消息
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
        <Record updateDialogue={updateDialogue} username={username}></Record>
      </div>
    </div>
  );
};

export default Dialogue;
