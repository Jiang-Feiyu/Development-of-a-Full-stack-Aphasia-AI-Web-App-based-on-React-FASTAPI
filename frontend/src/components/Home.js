import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import backgroundImage from './Background.jpeg';

function Home() {
  const [agree, setAgree] = useState(false);

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
  };

  const handleButtonClick = (path) => {
    if (!agree) {
      alert("Please agree to the terms to continue.");
    } else {
      // Redirect to login or signup page
      window.location.href = path;
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
    </div>
  );
}

export default Home;
