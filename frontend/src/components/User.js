import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./User.css";

function User() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const usernameParam = searchParams.get("usn");
        setUsername(usernameParam);
    }, [location.search]);

    const handleLogout = () => {
        navigate("/");
    };

    const handleDelete = () => {
        alert(username);
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
        <div class="content-box">
            <h2>Welcome {username}!</h2>
            <button class="button_sign_up" onClick={handleLogout}>Logout</button>
            <button class="button_sign_up" onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default User;