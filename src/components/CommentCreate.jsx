import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CommentCreate({ postId }) {
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null); // full user object
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 const token = JSON.parse(localStorage.getItem("user"))?.token;

useEffect(() => {
  const userData = JSON.parse(localStorage.getItem('user'));

  // Create headers with token
  const headers = {
    Authorization: `Bearer ${token}`
  };

  if (userData && userData.id) {
    axios.get(`http://localhost:8086/api/user/${userData.id}`, { headers })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user details", err);
        setLoading(false);
      });
  } else {
    console.error("User not found in localStorage");
    setLoading(false);
  }
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user || !comment.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      text: "Please fill in your comment before submitting.",
    });
    return;
  }

  // Set up headers with token
  const headers = {
    Authorization: `Bearer ${token}`
  };

  try {
    // Step 1: Fetch the skill post data with auth
    const postRes = await axios.get(
      `http://localhost:8086/api/skillposts/${postId}`,
      { headers }
    );
    const postData = postRes.data;

    // Step 2: Compare current user ID with the post owner's ID
    if (postData.user && postData.user.id === user.id) {
      Swal.fire({
        icon: "error",
        title: "Not Allowed",
        text: "You can't give feedback on your own post.",
      });
      return;
    }

    // Step 3: Proceed with submission
    const feedbackData = {
      comment,
      author: user.fullName,
      skillPostId: parseInt(postId),
      userId: user.id,
    };

    await axios.post(
      "http://localhost:8086/api/feedback/create",
      feedbackData,
      { headers } // Include token in POST request
    );

    Swal.fire({
      icon: "success",
      title: "Feedback Submitted",
      text: "Thank you for your feedback!",
    }).then(() => {
      window.location.reload();
    });

    setComment('');
  } catch (error) {
    console.error("Error submitting feedback", error);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "Something went wrong while submitting your feedback.",
    });
  }
};


  if (loading) return <div>Loading...</div>;

  return (
    <div className="comment-form">
      <h4>Leave a Reply</h4>
      <form onSubmit={handleSubmit} className="form-contact comment_form">
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <textarea
                className="form-control w-100"
                name="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={5}
                placeholder="Write Comment"
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                value={user?.fullName || ''}
                readOnly
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                value={user?.email || ''}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="button button-contactForm btn_1 boxed-btn">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentCreate;
