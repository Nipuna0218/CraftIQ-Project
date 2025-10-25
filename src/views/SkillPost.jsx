import React, { useEffect, useState } from 'react';
import CreatePost from '../components/skillPost/CreatePost';
import { Link } from 'react-router-dom';
import PostSIdeSingle from '../components/skillPost/PostSIdeSingle';
import axios from 'axios';

import img1 from '../assets/clients/img/blog/single_blog_1.png';
import img2 from '../assets/clients/img/blog/single_blog_1.png';
import img3 from '../assets/clients/img/blog/single_blog_1.png';
import img4 from '../assets/clients/img/blog/single_blog_1.png';

const imageFallbacks = [img1, img2, img3, img4];

function SkillPost() {
  const [skillPosts, setSkillPosts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

 const token = JSON.parse(localStorage.getItem("user"))?.token;
useEffect(() => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  axios.get('http://localhost:8086/api/skillposts/', { headers })
    .then(response => {
      const userPosts = response.data
        .filter(post => post.user?.id === currentUser?.id) // filter by logged-in user
        .map((post, index) => {
          const createdAt = new Date(post.createdAt);
          return {
            id: post.id,
            img: post.imageBase64
              ? `data:image/jpeg;base64,${post.imageBase64}`
              : imageFallbacks[index % imageFallbacks.length],
            title: post.title,
            summary: post.summary,
            pargrhap_1: post.pargrhap1,
            pargrhap_2: post.pargrhap2,
            pargrhap_3: post.pargrhap3,
            pargrhap_4: post.pargrhap4,
            pargrhap_5: post.pargrhap5,
            category: post.category || 'General',
            commentCount: '03 Comments',
            date: [
              {
                day: createdAt.getDate().toString(),
                month: createdAt.toLocaleString('default', { month: 'short' }),
                year: createdAt.getFullYear().toString()
              }
            ]
          };
        });
      setSkillPosts(userPosts);
    })
    .catch(error => {
      console.error('Failed to fetch skill posts:', error);
    });
}, [currentUser?.id]);

  return (
    <div>
      <section className="blog_area single-post-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 posts-list">
              <CreatePost />
            </div>
            <div className="col-lg-4">
              <div className="blog_right_sidebar">
                <aside className="single_sidebar_widget popular_post_widget">
                  <h3 className="widget_title">Your Post</h3>
                  {skillPosts.slice(0, 4).map(post => (
                    <PostSIdeSingle key={post.id} skillPost={post} />
                  ))}
                  <div className="pt-5">
                    <Link to="/user/viewSkillPost" className="button rounded-0 primary-bg text-white w-100 btn_1 boxed-btn mt-8">
                      View More
                    </Link>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SkillPost;
