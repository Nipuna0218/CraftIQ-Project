import React, { useEffect, useState } from "react";
import axios from "axios";

function UserCard() {
  const [userData, setUserData] = useState(null);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    axios
      .get(`http://localhost:8086/api/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, [token]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Use backend image URL if available, otherwise use placeholder
  const imageSrc = userData.hasImage
    ? `http://localhost:8086/api/user/${userData.id}/image`
    : "https://via.placeholder.com/150";

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={imageSrc}
            alt="User"
            className="rounded-circle"
            width={150}
            height={150}
          />
          <div className="mt-3">
            <h4>{userData.fullName || " "}</h4>
            <p className="text-secondary mb-1">{userData.category || " "}</p>
            <p className="text-muted font-size-sm">{userData.address || ""}</p>
            <p className="text-muted font-size-sm">
              Followers :{" "}
              {Array.isArray(userData.followers)
                ? userData.followers.length
                : 0}
            </p>
            <p className="text-muted font-size-sm">
              Following :{" "}
              {Array.isArray(userData.following)
                ? userData.following.length
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
