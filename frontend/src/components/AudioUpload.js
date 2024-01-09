import React, { useState } from 'react';

const AudioUpload = ({ username }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an audio file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('usn', username);

    try {
      const response = await fetch('http://localhost:8000/upload_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        console.error('Error occurred while uploading audio:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while uploading audio:', error.message);
    }
  };

  return (
    <div>
      <h5 style={{ marginBottom: '10px' }}>Upload Audio:</h5>
    </div>
  );
};

export default AudioUpload;
