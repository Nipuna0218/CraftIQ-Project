import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UpdatePost from '../components/skillPost/UpdatePost';

function SkillPostEdit() {
  const { id } = useParams();
  const [skillPost, setSkillPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8086/api/skillposts/${id}`)
      .then(response => {
        const post = response.data;
        setSkillPost({
          ...post,
          img: post.imageBase64 ? `data:image/jpeg;base64,${post.imageBase64}` : '',
        });
      })
      .catch(error => {
        console.error('Failed to fetch post:', error);
      });
  }, [id]);

  if (!skillPost) {
    return <div className="text-center mt-5">Loading post...</div>;
  }

  return (
    <div>
      <section className="blog_area single-post-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 posts-list">
              <UpdatePost skillPost={skillPost} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SkillPostEdit;
