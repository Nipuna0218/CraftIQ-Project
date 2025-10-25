import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


function FeeadbackManagment() {
  // Filter comments where userId === 1

  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedFeedback, setEditedFeedback] = useState({});
  // Get logged-in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const loggedInUserId = loggedInUser?.id;
 const token = JSON.parse(localStorage.getItem("user"))?.token;

 const authHeaders = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};


  const handleEditClick = (id, currentText) => {
    setEditingId(id);
    setEditedFeedback((prev) => ({ ...prev, [id]: currentText }));
  };

const handleSaveClick = async (id) => {
  const updatedComment = editedFeedback[id];

  try {
    await axios.put(`http://localhost:8086/api/feedback/${id}`, {
      comment: updatedComment
    }, authHeaders);

    // Update local state to reflect saved comment
    setUserComments(prevComments =>
      prevComments.map(c =>
        c.id === id ? { ...c, comment: updatedComment } : c
      )
    );

    setEditingId(null);
  } catch (error) {
    console.error("Failed to update feedback", error);
    alert("Error updating feedback. Please try again.");
  }
};

const handleDeleteClick = async (id) => {
  const confirmed = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this feedback!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (confirmed.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8086/api/feedback/${id}`, authHeaders);
      setUserComments(prev => prev.filter(comment => comment.id !== id));

      Swal.fire({
        title: 'Deleted!',
        text: 'Your feedback has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete feedback.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
};

  const handleChange = (e, id) => {
    setEditedFeedback((prev) => ({ ...prev, [id]: e.target.value }));
  };




useEffect(() => {
  if (!loggedInUserId) {
    setLoading(false);
    return;
  }

  // Fetch all feedbacks
  axios.get('http://localhost:8086/api/feedback/', authHeaders)
    .then(async (res) => {
      const allFeedbacks = res.data;

      // Filter feedbacks for the logged in user
      const filteredFeedbacks = allFeedbacks.filter(fb => fb.userId === loggedInUserId);

      // Enrich each feedback with user image and skill post image
      const enrichedComments = await Promise.all(filteredFeedbacks.map(async (feedback) => {
        try {
          // Fetch user info for profile image
          const userRes = await axios.get(`http://localhost:8086/api/user/${feedback.userId}`, authHeaders);
          const user = userRes.data;
          const userImg = user.imageBase64 ? `data:image/jpeg;base64,${user.imageBase64}` : '';

          // Fetch skill post info for post image
          const postRes = await axios.get(`http://localhost:8086/api/skillposts/${feedback.skillPostId}`, authHeaders);
          const post = postRes.data;
          const postImg = post.imageBase64 ? `data:image/jpeg;base64,${post.imageBase64}` : '';

          return {
            id: feedback.id,
            comment: feedback.comment,
            author: user.fullName || feedback.author,
            userImg,
            postImg,
            postTitle: post.title || 'Untitled Post',
            date: feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : '',
          };
        } catch (err) {
          console.error('Error fetching data for feedback:', err);
          return null;
        }
      }));

      // Remove any nulls from failed fetches
      setUserComments(enrichedComments.filter(c => c !== null));
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching feedbacks:', err);
      setLoading(false);
    });
}, [loggedInUserId]);







  if (loading) return <p>Loading feedback...</p>;

  if (!loggedInUserId) return <p>Please login to see your feedback.</p>;



  return (
    <div className="whole-wrap">
      <div className="container box_1170">
        <div className="section-top-border">
          <h3 className="mb-30">User Feedback</h3>



          <div className="row">
            {userComments.map(comment => (
              <div className="col-lg-12 mb-5" key={comment.id}>
                <div className="d-flex align-items-center mb-4">
                  {/* User profile image */}
                  <img
                    src={comment.postImg}
                    alt={comment.author}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      marginRight: '15px',
                    }}
                  />
                  <div>
                    <strong>{comment.author}</strong><br />
                    <small>{comment.date}</small>
                  </div>
                </div>
                <h5>{comment.postTitle}</h5>

                {editingId === comment.id ? (
                  <textarea
                    className="form-control"
                    rows="5"
                    value={editedFeedback[comment.id]}
                    onChange={(e) => handleChange(e, comment.id)}
                    style={{ marginBottom: '15px' }}
                  />
                ) : (
                  <blockquote className="generic-blockquote">
                    {editedFeedback[comment.id] || comment.comment}
                  </blockquote>
                )}

                {editingId === comment.id ? (
                  <button
                    className="btn btn-success mr-2"
                    onClick={() => handleSaveClick(comment.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => handleEditClick(comment.id, comment.comment)}
                  >
                    Edit
                  </button>

                )}

                <button className="btn btn-danger" onClick={() => handleDeleteClick(comment.id)}>
                  Delete
                </button>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeeadbackManagment;
