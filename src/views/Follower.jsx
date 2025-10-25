import React, { useEffect, useState } from 'react';
import FollowerCard from '../components/UserProfile/FollowerCard' 

function Follower() {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchFollowers = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = JSON.parse(userStr)?.token;

      if (!userStr || !token) return;

      const currentUser = JSON.parse(userStr);
      const userId = currentUser.id;

      // Step 1: Get current user details
      const resUser = await fetch(`http://localhost:8086/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resUser.ok) throw new Error('Failed to fetch user details');
      const userData = await resUser.json();

      // Step 2: Fetch each follower's metadata with token
      const followersData = await Promise.all(
        userData.followers.map(async (follower) => {
          const resFollower = await fetch(`http://localhost:8086/api/user/${follower.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!resFollower.ok) throw new Error('Failed to fetch follower details');
          const followerDetails = await resFollower.json();

          return {
            id: followerDetails.id,
            img: `http://localhost:8086/api/user/${followerDetails.id}/image`,
            name: followerDetails.fullName,
            category: followerDetails.category || 'N/A',
          };
        })
      );

      setFollowers(followersData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  fetchFollowers();
}, []);


  if (loading) return <div>Loading followers...</div>;
  if (followers.length === 0) return <div>No followers found</div>;

  return (
    <div>
      <div className="team-area section-padding30">
        <div className="container">
          <div className="row">
            <div className="cl-xl-7 col-lg-8 col-md-10">
              <div className="section-tittles mb-70">
                <span>Your followers</span>
                <h2>Followers</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {followers.map((user) => (
              <FollowerCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Follower;
