import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./User.css";
import Dialogue from './Dialogue';

function User() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [paths, setPaths] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const usernameParam = searchParams.get("usn");
        setUsername(usernameParam);
    }, [location.search]);

    const handleLogout = () => {
        navigate("/");
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure?");
        if (confirmDelete) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8000/delete");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    alert(data.message);
                    navigate("/");
                } else {
                    console.error("Error occurred while deleting user:", xhr.statusText);
                }
            };
            xhr.onerror = () => {
                console.error("Error occurred while deleting user:", xhr.statusText);
            };
            xhr.send(JSON.stringify({ usn: username }));
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
            <Dialogue username={username} />
        </div>
    );
}

export default User;