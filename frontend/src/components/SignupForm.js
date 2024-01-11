import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SignupForm.css";

const SignupForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // check whether the user exists(Need to be finished later)
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const existingUsername = existingUsers.find(
      (user) => user.username === username
    );

    if (existingUsername) {
      alert("Registration failed. Username already exists.");
      return;
    }

    // check whether the username is a valid email address
    if (!isEmailValid(username)) {
      alert("Registration failed. Email address is invalid.");
      return;
    }

    // check whether the key meet the criteria
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Registration failed. Password format is incorrect.");
      return;
    }

    const data = {
      plain_password: password,
    };

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: username, pwd: password }),
      });

      if (response.ok) {
        navigate('/user');
      } else {
        const data = await response.json();
        if (response.status === 400 && data.detail === "Username already exists") {
          alert("Registration failed: Username already exists");
        } else {
          alert(`Registration failed: ${data.detail}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateRandomPassword = () => {
    const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";

    // randomly generate a key length between 8 to 15
    const passwordLength = Math.floor(Math.random() * 8) + 8;

    // Add at least a special char, a upper and lower char and some numbers
    let password = "";
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password +=
      upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    password +=
      lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    password += digits[Math.floor(Math.random() * digits.length)];

    // Add other char randomly
    for (let i = 0; i < passwordLength - 4; i++) {
      const charType = Math.floor(Math.random() * 4); // 0: special char, 1: upper case, 2: lower case, 3: digit
      if (charType === 0) {
        password +=
          specialChars[Math.floor(Math.random() * specialChars.length)];
      } else if (charType === 1) {
        password +=
          upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
      } else if (charType === 2) {
        password +=
          lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
      } else {
        password += digits[Math.floor(Math.random() * digits.length)];
      }
    }

    return password;
  };

  const [recommendedPassword, setRecommendedPassword] = useState(
    generateRandomPassword()
  );

  const handleGenerateNewPassword = () => {
    setRecommendedPassword(generateRandomPassword());
  };

  return (
    <div>
      <div className="content-box">
        <div className="button_sign_up">
          <div className="border">
            <h2>Email:</h2>
            <h5>In the format of: username@example.com</h5>
            <input
              type="text"
              placeholder="Email Address"
              value={username}
              onChange={handleUsernameChange}
            />
            {isEmailValid === false && (
              <div style={{ color: "red" }}>email address invalid</div>
            )}
            <h2>Password: </h2>
            <div className="info">
              <h5>At least 8 characters</h5>
              <h5>
                Contains uppercase letters, lowercase letters, and special
                characters
              </h5>
              <h5>Contains numbers from 0 to 9</h5>
              <h5> (special characters include: !@#$%^&amp;*() )</h5>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div style={{ marginTop: "5px" }}>
              <h4>Suggested Password:</h4>
              <input
                type="text"
                value={recommendedPassword}
                readOnly
                className="no-border"
              />
              <button
                className="small-grey"
                onClick={handleGenerateNewPassword}
              >Change one
              </button>
            </div>
            <h1></h1>
            <Link to="/">
              <button className="signup-btn">Back</button>
            </Link>
            <button className="signup-btn" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;