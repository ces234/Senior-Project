import React from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import for useNavigate

const LandingPage = () => {
    const navigate = useNavigate(); // Use useNavigate hook

    const handleLogin = () => {
        navigate("/login"); // Use navigate function to redirect
    }

    const handleSignup = () => {
        navigate ("/signup");
    }

    return (
        <div>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignup} >Sign up</button>
        </div>
    )
}

export default LandingPage;
