import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 
import WholeLogo from './Whole_logo.png';


const LandingPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSignup = () => {
        navigate("/signup");
    };

    return (
        <div className="landingPageContainer">
            <div className="screen">
                <img src={WholeLogo} alt="Center Display" className="centerImage" />
            </div>
            <div className="buttonContainer">
                <button className="landingButton" onClick={handleLogin}>Login</button>
                <button className="landingButton" onClick={handleSignup}>Register</button>
            </div>
        </div>
    );
};

export default LandingPage;
