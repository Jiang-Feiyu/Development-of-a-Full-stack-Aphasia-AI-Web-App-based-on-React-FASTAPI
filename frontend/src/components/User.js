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

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure?");
        if (confirmDelete) {
            // 请你设计一个请求
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