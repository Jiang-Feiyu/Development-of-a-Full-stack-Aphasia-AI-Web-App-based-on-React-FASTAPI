import React, { useState, useRef } from 'react';

const Record = ({ username }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleToggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };
        chunksRef.current = []; // Clear previous chunks
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch(err => console.error('Error accessing microphone:', err));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
      const formData = new FormData();
      formData.append('audio', audioBlob, `${username}_recording.mp3`);

      // Log form data to check if it's correctly constructed
      console.log('Form Data:', formData);

      // Log file size and type
      console.log('File Size:', audioBlob.size);
      console.log('File Type:', audioBlob.type);

      fetch('http://localhost:8000/record-audio', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to upload audio');
        }
        // Handle successful upload
        console.log('Audio uploaded successfully');
      })
      .catch(error => {
        console.error('Error uploading audio:', error);
      });
    }
  };

  return (
    <div>
      <button onClick={handleToggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default Record;