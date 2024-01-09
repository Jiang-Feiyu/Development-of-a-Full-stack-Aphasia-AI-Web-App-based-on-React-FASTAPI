import React, { useState, useRef } from "react";
import "./Dialogue.css";

const Dialogue = ({ username }) => {
  const [dialogue, setDialogue] = useState([]);
  const dialogueRef = useRef(null);

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
      // Removed the code that sends a request to the backend
  
      setDialogue([
        ...dialogue,
        { user: "User", message: `Upload an Audio: ${file.name}` },
        { user: "System", message: `File selected: ${file.name}` }, // Adjusted the message accordingly
      ]);
    } else {
      console.log("File exceeds 5 MB size limit.");
    }
  };  

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size <= 5 * 1024 * 1024) { // 5 MB size limit
      // Simulating file upload
      setTimeout(() => {
        setDialogue([
          ...dialogue,
          { user: "User", message: `Upload an Audio: ${file.name}` },
          { user: "System", message: "Received!" },
        ]);
      }, 1000);
    } else {
      alert("File exceeds 5 MB size limit.");
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
            </div>
          ))}
        </div>
      </div>
      <div className="button-group">
        <label className="file-upload-btn">
          <input type="file" onChange={handleFileInputChange} />
        </label>
        <button className="start-btn">Start</button>
        <button className="stop-btn">Stop</button>
      </div>
    </div>
  );
};

export default Dialogue;
