import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./User.css";
import Dialogue from './Dialogue';

function User() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password] = useState(""); // 新添加的密码状态
    const [paths] = useState([]);
    const [confirmPassword] = useState(""); // 定义确认密码变量

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const usernameParam = searchParams.get("usn");
        setUsername(usernameParam);
    }, [location.search]);

    const handleLogout = () => {
        navigate("/");
    };

    const handleDelete = async () => {
        console.log("Deleting user with username:", username);
        const confirmDelete = window.confirm("Are you sure?");
        if (confirmDelete) {
            try {
                const response = await fetch('http://3.27.151.169/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ',  // + YOUR_ACCESS_TOKEN Add your authentication token if needed
                    },
                    body: JSON.stringify({
                        usn: username,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                    navigate("/");
                } else {
                    console.error("Error occurred while deleting user:", response.statusText);
                }
            } catch (error) {
                console.error("Error occurred while deleting user:", error.message);
            }
        }
    };

    const handleChangePassword = async () => {
        const newPassword = prompt("Enter new password:");

        // 检查密码强度
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert("Registration failed. Password should be at least 8 characters, containing uppercase letters, lowercase letters, and special characters with number from 0 to 9 and special characters include: !@#$%^&amp;*()");
            return;
        }

        // 检查密码和确认密码是否匹配
        if (password !== confirmPassword) {
            alert("Password and confirm password do not match.");
            return;
        }

        if (newPassword) {
            try {
                const response = await fetch('http://3.27.151.169/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ',  // + YOUR_ACCESS_TOKEN Add your authentication token if needed
                    },
                    body: JSON.stringify({
                        usn: username,
                        pwd: newPassword
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                } else {
                    console.error("Error occurred while changing password:", response.statusText);
                }
            } catch (error) {
                console.error("Error occurred while changing password:", error.message);
            }
        }
    };

    return (
        <div className="content-box">
            <h2>Welcome {username}!</h2>
            <div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {paths.map((path, index) => (
                        <li key={index} style={{ marginBottom: '5px', fontSize: '16px', color: '#333', borderBottom: '1px solid #ddd', padding: '5px 0' }}>{path}</li>
                    ))}
                </ul>
            </div>
            <button className="button_sign" onClick={handleLogout}>Logout</button>
            <button className="button_sign" onClick={handleDelete}>Delete the account</button>
            <button className="button_sign" onClick={handleChangePassword}>Change Password</button> {/* 新的修改密码按钮 */}
            <Dialogue username={username} />
        </div>
    );
}

export default User;