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
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }) // 显式指定捕获音频，而不捕获视频
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (e) => {
                    chunksRef.current.push(e.data);
                };
                chunksRef.current = []; // 清除先前的数据块
                mediaRecorderRef.current.start();
                setIsRecording(true);
            })
            .catch(err => console.error('访问麦克风时出错：', err));
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

    const uploadAudio = (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, `${username}_recording.wav`);

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
