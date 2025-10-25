import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import FindUserCard from '../components/UserProfile/FindUserCard';
import Swal from 'sweetalert2';

function FindUser() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

 const loggedInUser = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
 const token = JSON.parse(localStorage.getItem("user"))?.token;

useEffect(() => {
  if (!loggedInUser?.id) return;

  axios.get('http://localhost:8086/api/user/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      const allUsers = res.data;
      const current = allUsers.find(u => u.id === loggedInUser.id);
      setCurrentUser(current);

      const filteredUsers = allUsers
        .filter(user => user.id !== loggedInUser.id)
        .map(user => ({
          id: user.id,
          name: user.fullName || user.email,
          img: user.imageBase64
            ? `data:image/jpeg;base64,${user.imageBase64}`
            : 'https://via.placeholder.com/150',
          isFollowing: current?.following?.some(f => f.id === user.id)
        }));

      setUsers(filteredUsers);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
    });
}, []);


const handleFollow = async (targetUserId) => {
  if (!currentUser) return;

  try {
    // 1. Get the target user from API
    const targetUserRes = await axios.get(`http://localhost:8086/api/user/${targetUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const targetUser = targetUserRes.data;

    // 2. Update logged-in user's following list
    const updatedFollowing = [...(currentUser.following || []), { id: targetUserId }];
    await axios.put(`http://localhost:8086/api/user/${currentUser.id}`, {
      ...currentUser,
      following: updatedFollowing
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 3. Update target user's followers list
    const updatedFollowers = [...(targetUser.followers || []), { id: currentUser.id }];
    await axios.put(`http://localhost:8086/api/user/${targetUserId}`, {
      ...targetUser,
      followers: updatedFollowers
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 4. UI feedback and local update
    Swal.fire({
      icon: 'success',
      title: 'Followed!',
      text: 'You are now following this user.',
      timer: 1500,
      showConfirmButton: false
    });

    // Update frontend state
    setUsers(prev =>
      prev.map(user =>
        user.id === targetUserId ? { ...user, isFollowing: true } : user
      )
    );

    // Update currentUser in state (optional, for consistency)
    setCurrentUser(prev => ({
      ...prev,
      following: updatedFollowing
    }));

  } catch (error) {
    console.error("Failed to follow user:", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: 'Failed to follow user.',
    });
  }
};



  return (
    <div className="whole-wrap">
      <div className="container box_1170">
        <div className="row">
          {users.map(user => (
            <div key={user.id} className="col-md-4 mb-4">
              <FindUserCard user={user} onFollow={handleFollow} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FindUser;
