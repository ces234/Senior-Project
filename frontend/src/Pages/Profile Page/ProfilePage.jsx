import "./ProfilePage.css";
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../AuthContext";

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const token = localStorage.getItem("token");
    const [joinCode, setJoinCode] = useState(null);

    useEffect(() => {
        const fetchJoinCode = async () => {
            if (!token) {
                console.error("Token is missing, unable to fetch join code");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8000/user/join-code/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch join code");
                const fetchedJoinCode = await response.json();
                setJoinCode(fetchedJoinCode.join_code); // Extract `join_code` property
            } catch (error) {
                console.error("Error fetching join code: ", error);
            }
        };

        fetchJoinCode();
    }, [token]);

    return (
        <div>
            {joinCode ? (
                <div>Join Code: {joinCode}</div>
            ) : (
                <div>Loading join code...</div>
            )}
        </div>
    );
};

export default ProfilePage;
