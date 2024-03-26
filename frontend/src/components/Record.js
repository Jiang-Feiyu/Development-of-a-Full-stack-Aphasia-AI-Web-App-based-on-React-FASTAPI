// Record.js
import React, { useState, useRef } from 'react';

const Record = ({ updateDialogue, username }) => {
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
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (e) => {
                    chunksRef.current.push(e.data);
                };
                chunksRef.current = [];
                mediaRecorderRef.current.start();
                setIsRecording(true);
                updateDialogue("Online Audio", "User"); // 添加 "User: Online Audio" 消息
            })
            .catch(err => console.error('Error accessing microphone:', err));
    };


    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.addEventListener('stop', () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                uploadAudio(audioBlob);
            });
        }
    };

    const uploadAudio = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, `${username}_recording.wav`);

        try {
            const response = await fetch('http://3.27.151.169/record-audio', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                console.error('File upload failed');
                return;
            }

            const data = await response.json();
            updateDialogue(`File uploaded: ${data.filename}, Size: ${data.file_size} bytes`, "System");
            updateDialogue(data.answer, "System"); // 使用后端返回的消息
        } catch (error) {
            console.error('Error uploading audio:', error);
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
