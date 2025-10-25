import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
function AllPost({ skillpost }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?.id || !user?.token || !skillpost?.id) return;

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const fetchLikeData = async () => {
      try {
        // Get current like count
        const likeCountRes = await axios.get(
          `http://localhost:8086/api/likes/count?postId=${skillpost.id}`,
          config
        );
        setLikes(likeCountRes.data);

        // Get if current user has liked this post
        const statusRes = await axios.get(
          `http://localhost:8086/api/likes/status?postId=${skillpost.id}&userId=${user.id}`,
          config
        );
        setLiked(statusRes.data); // boolean
      } catch (err) {
        console.error('Error loading like info:', err);
      }
    };

    fetchLikeData();
  }, [skillpost?.id, user?.id, user?.token]);

  const handleLikeToggle = async () => {
    if (!user?.id || !user?.token) {
      console.error('User not authenticated');
      return;
    }

    // Prevent self-liking
    if (skillpost.userId === user.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: "You can't like your own skill post!",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      if (!liked) {
        await axios.post(
          `http://localhost:8086/api/likes/like?postId=${skillpost.id}&userId=${user.id}`,
          {},
          config
        );
        setLikes((prev) => prev + 1);
        setLiked(true);
      } else {
        await axios.delete(
          `http://localhost:8086/api/likes/unlike?postId=${skillpost.id}&userId=${user.id}`,
          config
        );
        setLikes((prev) => (prev > 0 ? prev - 1 : 0));
        setLiked(false);
      }
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };


  return (
    <div>
      <div>
        <div className="blog_left_sidebar">
          <article className="blog_item">
            <div className="blog_item_img">
              <img
                className="card-img rounded-0"
                src={skillpost.img}
                alt=""
                style={{ width: '770px', height: '370px' }}
              />
              {skillpost.date && skillpost.date.length > 0 && (
                <a href="#" className="blog_item_date">
                  <h3>{skillpost.date[0].day}</h3>
                  <p>{skillpost.date[0].month}</p>
                </a>
              )}
            </div>

            <div className="blog_details">
              <Link className="d-inline-block" to={`/user/skill-post-details/${skillpost.id}`}>
                <h2>{skillpost.title}</h2>
              </Link>

              <p>{skillpost.summary}</p>
              <ul className="blog-info-link">
                <li><a href="#"><i className="fa fa-user" /> {skillpost.username}</a></li>
                <li><a href="#"><i className="fa fa-comments" /> {skillpost.commentCount}</a></li>
                <li>
               <div>
      <button onClick={handleLikeToggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        {liked ? '💙' : '❤️'}
      </button>
      <span style={{ marginLeft: '8px' }}>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    </div>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export default AllPost;
