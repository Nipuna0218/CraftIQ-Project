import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDetails() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const localUserData = JSON.parse(localStorage.getItem('user'));
  const userId = localUserData?.id || localUserData?.userId;
const token = localUserData?.token;



  useEffect(() => {
    if (!userId) {
      setError('User ID not found in local storage.');
      setLoading(false);
      return;
    }

  const fetchUserData = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`http://localhost:8086/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(response.data);
  } catch (err) {
    setError('Failed to fetch user data.');
  } finally {
    setLoading(false);
  }
};


    fetchUserData();
  }, [userId]);

const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete your account?");
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:8086/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.clear();
    window.location.href = "/register"; 
  } catch (err) {
    console.error(err);
    alert("Failed to delete user account.");
  }
};


  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Full Name</h6>
        </div>
        <div className="col-sm-9 text-secondary">{user.fullName || '-'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Email</h6>
        </div>
        <div className="col-sm-9 text-secondary">{user.email || '-'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Phone</h6>
        </div>
        <div className="col-sm-9 text-secondary">{user.tpNum || '-'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Category</h6>
        </div>
        <div className="col-sm-9 text-secondary">{user.category || '-'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Address</h6>
        </div>
        <div className="col-sm-9 text-secondary">{user.address || '-'}</div>
      </div>
      <hr />
      <div className="row mb-3 mt-3">
        <div className="col-sm-3">
          <h6 className="mb-0">Bio</h6>
        </div>
        <div className="col-sm-9">
          <textarea
            className="form-control text-secondary"
            rows={4}
            value={user.bio || ''}
            readOnly
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-12">
          <Link to="/user/user-edit" className="btn btn-info">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger ml-3">Delete</button>

        </div>
      </div>
    </div>
  );
}

export default UserDetails;
