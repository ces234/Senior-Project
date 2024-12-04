import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, logout, isAdmin } = useAuth();
  const token = localStorage.getItem("token");

  const [joinCode, setJoinCode] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchJoinCode = async () => {
      if (!token) {
        console.error("Token is missing, unable to fetch join code");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/user/join-code/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch join code");
        const fetchedJoinCode = await response.json();
        setJoinCode(fetchedJoinCode.join_code);
      } catch (error) {
        console.error("Error fetching join code: ", error);
      }
    };

    const fetchHouseholdMembers = async () => {
      if (!token) {
        console.error("Token is missing, unable to fetch household members");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/user/household-members/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch household members");
        const fetchedMembers = await response.json();
        setMembers(fetchedMembers);
        setLoadingMembers(false);
      } catch (error) {
        console.error("Error fetching household members: ", error);
        setLoadingMembers(false);
      }
    };

    fetchJoinCode();
    fetchHouseholdMembers();
  }, [token]);

  return (
    <div className="profilePage">
      <div className="profileContainer">
        <div className="header">
          <h1 className="profileTitle">{user?.username || "User"}'s Account</h1>
          {isAdmin() && (
            <div className="adminBadge">
              <span className="crownIcon">👑</span> Admin
            </div>
          )}
        </div>
        <div className="profileDetails">
          <div className="detailRow">
            <div className="detailBox">
              <span className="label">Household Code:</span>
              <span className="value">{joinCode || "Loading..."}</span>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div className="householdMembers">
          <h2>Household Members:</h2>
          {loadingMembers ? (
            <p>Loading household members...</p>
          ) : members.length === 0 ? (
            <p>No household members found.</p>
          ) : (
            members.map((member) => (
              <div className="memberRow" key={member.id}>
                <div className="memberBox">
                  <span className="memberName">
                    {member.username}
                    {member.status == "admin" && (
                      <span className="secondAdminBadge">👑 {/* Crown Icon */}</span>
                    )}
                  </span>
                  <span className="memberDetail">Favorite Meal: N/A</span>
                  <button className="addRecipeButton">Add Recipe +</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
