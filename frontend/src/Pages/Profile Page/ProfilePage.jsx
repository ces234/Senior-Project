import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import "./ProfilePage.css";

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
        setJoinCode(fetchedJoinCode.join_code);
      } catch (error) {
        console.error("Error fetching join code: ", error);
      }
    };

    fetchJoinCode();
  }, [token]);

  return (
    <div className="profilePage">
  <div className="profileContainer">
    <div className="header">
      <h1 className="profileTitle">Alice's Account</h1>
      <div className="adminBadge">
        <span className="crownIcon">👑</span> Admin
      </div>
    </div>

    <div className="profileDetails">
      <div className="detailRow">
        <div className="detailBox">
          <span className="label">Household Code:</span>
          <span className="value">{joinCode || "Loading..."}</span>
        </div>
      </div>
      <div className="detailRow">
        <div className="detailBox">
          <span className="label">Email Address:</span>
          <span className="value">{user?.email || "Loading..."}</span>
        </div>
      </div>
      <button className="resetPasswordButton">Reset Password</button>
    </div>

    <hr className="divider" />

    <div className="householdMembers">
      <h2>Household Members:</h2>
      {["Bob", "Little Timmy", "Aunt Linda"].map((name) => (
        <div className="memberRow" key={name}>
          <div className="memberBox">
            <span className="memberName">{name}</span>
            <span className="memberDetail">Favorite Meal: Daddy's Chicken</span>
            <button className="addRecipeButton">Add Recipe +</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  
  );
};

export default ProfilePage;
