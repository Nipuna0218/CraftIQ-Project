import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentView from '../components/CommentView'
import CommentCreate from '../components/CommentCreate'
import SlideBar from '../components/SlideBar'
import SkillPostSingle from '../components/skillPost/SkillPostSingle'
function SkillPostDetails() {
  const { id } = useParams();
  const [skillPost, setSkillPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
 const token = JSON.parse(localStorage.getItem("user"))?.token;
  // Optionally: handle comments
  const [comments, setComments] = useState([]);

useEffect(() => {
  setLoading(true);

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // Fetch Skill Post
  axios.get(`http://localhost:8086/api/skillposts/${id}`, { headers })
    .then(response => {
      const post = response.data;
      const formattedPost = {
        id: post.id,
        img: post.imageBase64 ? `data:image/jpeg;base64,${post.imageBase64}` : '',
        title: post.title,
        summary: post.summary,
        pargrhap_1: post.pargrhap1,
        pargrhap_2: post.pargrhap2,
        pargrhap_3: post.pargrhap3,
        pargrhap_4: post.pargrhap4,
        pargrhap_5: post.pargrhap5,
        category: post.category || "General",
        commentCount: Array.isArray(post.feedbacks) ? post.feedbacks.length : 0,
        user: post.user,
      };

      setSkillPost(formattedPost);

      // Fetch author
      if (post.user && post.user.id) {
        axios.get(`http://localhost:8086/api/user/${post.user.id}`, { headers })
          .then(userResponse => {
            const userData = userResponse.data;
            setAuthor({
              fullName: userData.fullName,
              profileImage: userData.imageBase64
                ? `data:image/jpeg;base64,${userData.imageBase64}` : '',
            });
          });
      }

      // Fetch all feedbacks and filter by skillPostId
      axios.get(`http://localhost:8086/api/feedback/`, { headers })
        .then(async feedbackRes => {
          const allFeedbacks = feedbackRes.data;

          // Filter feedbacks for this skillPost
          const filteredFeedbacks = allFeedbacks.filter(fb => fb.skillPostId === post.id);

          // Enrich feedbacks with user data
          const enrichedComments = await Promise.all(
            filteredFeedbacks.map(async (feedback) => {
              try {
                const userRes = await axios.get(`http://localhost:8086/api/user/${feedback.userId}`, { headers });
                const user = userRes.data;
                return {
                  id: feedback.id,
                  img: user.imageBase64 ? `data:image/jpeg;base64,${user.imageBase64}` : '',
                  author: user.fullName,
                  pargrhap: feedback.comment,
                  date: new Date(feedback.createdAt).toLocaleDateString(),
                };
              } catch (err) {
                console.error("Error loading user for feedback", err);
                return {
                  id: feedback.id,
                  img: '',
                  author: 'Unknown',
                  pargrhap: feedback.comment,
                  date: new Date(feedback.createdAt).toLocaleDateString(),
                };
              }
            })
          );

          setComments(enrichedComments);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching feedbacks", err);
          setLoading(false);
        });
    })
    .catch(error => {
      console.error("Error fetching skill post:", error);
      setLoading(false);
    });
}, [id]);


  if (loading) return <div>Loading...</div>;
  if (!skillPost) return <div>Post not found</div>;

  return (
    <section className="blog_area single-post-area section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 posts-list">
            <SkillPostSingle skillPost={skillPost} author={author} />

            <div className="comments-area">
              <h4>{comments.length} Comments</h4>
              {comments.map(comment => (
                <CommentView key={comment.id} comment={comment} />
              ))}
            </div>


            <CommentCreate postId={id} />
          </div>

          <div className="col-lg-4">
            <SlideBar />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillPostDetails;
