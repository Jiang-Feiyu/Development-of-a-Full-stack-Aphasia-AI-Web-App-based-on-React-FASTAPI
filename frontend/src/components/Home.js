import React, { useState, useEffect } from 'react';
import './Home.css';
import backgroundImage from './Background.jpeg';

function Home() {
  const [agree, setAgree] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState('prompt');

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' });
        setMicrophonePermission(result.state);
        result.onchange = () => {
          setMicrophonePermission(result.state);
        };
      } catch (error) {
        console.error('Error checking microphone permission:', error);
      }
    };

    checkMicrophonePermission();
  }, []);

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
  };

  const handleButtonClick = async (path) => {
    if (!agree) {
      alert("Please agree to the terms to continue.");
    } else if (microphonePermission !== 'granted') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        window.location.href = path; // 请求麦克风权限后执行重定向
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access to continue.');
      }
    } else {
      // Redirect to login or signup page
      window.location.href = path;
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to continue.');
    }
  };

  return (
    <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content-box">
        <h2>Welcome to AI speech recognition system</h2>
        <div className="terms">
          <label>
            <h5>
              <input type="checkbox" checked={agree} onChange={handleAgreeChange} />
              I agree to the terms: I consent to the use of microphone and storage permissions.
            </h5>
          </label>
        </div>
        <div className="button-group">
          <button className="login-btn" onClick={() => handleButtonClick("/login")}>Login</button>
          <button className="signup-btn" onClick={() => handleButtonClick("/signup")}>Sign Up</button>
        </div>
      </div>
      <div>
        <button onClick={requestMicrophonePermission} style={{ position: "absolute", top: 10, left: 10 }}>
          Request Microphone Permission
        </button>
      </div>
    </div>
  );
}

export default Home;
