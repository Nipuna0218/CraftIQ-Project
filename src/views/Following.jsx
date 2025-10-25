import React, { useEffect, useState } from 'react';
import FollowerCard from '../components/UserProfile/FollowerCard' 

function Following() {
const [following, setFollowing] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchFollowing = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = JSON.parse(userStr)?.token;

      if (!userStr || !token) return;

      const currentUser = JSON.parse(userStr);
      const userId = currentUser.id;

      // Fetch current user details
      const resUser = await fetch(`http://localhost:8086/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resUser.ok) throw new Error('Failed to fetch user details');
      const userData = await resUser.json();

      // Fetch each followed user with Authorization header
      const followingData = await Promise.all(
        userData.following.map(async (user) => {
          const res = await fetch(`http://localhost:8086/api/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error('Failed to fetch user');
          const details = await res.json();

          return {
            id: details.id,
            img: `http://localhost:8086/api/user/${details.id}/image`,
            name: details.fullName,
            category: details.category || 'N/A',
          };
        })
      );

      setFollowing(followingData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  fetchFollowing();
}, []);


  if (loading) return <div>Loading following...</div>;
  if (following.length === 0) return <div>You are not following anyone yet.</div>;

  return (
    <div>
      <div className="team-area section-padding30">
        <div className="container">
          <div className="row">
            <div className="cl-xl-7 col-lg-8 col-md-10">
              <div className="section-tittles mb-70">
                <span>Your following</span>
                <h2>Following</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {following.map((user) => (
              <FollowerCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Following;
