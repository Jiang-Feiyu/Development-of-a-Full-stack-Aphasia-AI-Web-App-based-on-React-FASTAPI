import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginForm.css"; 

const LoginForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: username, pwd: password }),
      });

      if (response.ok) {
        navigate(`/user?usn=${encodeURIComponent(username)}`); // 将用户名作为查询参数传递
      } else {
        const data = await response.json();
        alert(`Login failed: ${data.detail}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="content-box">
      <div className="button_sign_up">
        <h2>Email:</h2>
        <input
          type="text"
          placeholder="Email Address"
          value={username}
          onChange={handleUsernameChange}
        />
        <h2>Password:</h2>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="button-container">
        <Link to="/">
          <button className="signup-btn">Back</button>
        </Link>
        <button className="signup-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;