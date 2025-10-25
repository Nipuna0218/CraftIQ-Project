import { useEffect, useState } from 'react';
import axios from 'axios';
import RecentPostCard from './skillPost/RecentPostCard'

function SlideBar() {
  const [recentPosts, setRecentPosts] = useState([]);

 
  useEffect(() => {
    const fetchSkillPosts = async () => {
      try {
        // Retrieve token from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = storedUser?.token;

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await axios.get('http://localhost:8086/api/skillposts/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const sortedPosts = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
          .slice(0, 6);

        setRecentPosts(sortedPosts);
      } catch (error) {
        console.error("Failed to fetch skill posts", error);
      }
    };

    fetchSkillPosts();
  }, []);


  return (
    <div className="blog_right_sidebar">
      <aside className="single_sidebar_widget post_category_widget">
        <h4 className="widget_title">Category</h4>
        <ul className="list cat-list">
          <li><a href="#" className="d-flex"><p>Restaurant food</p><p>(37)</p></a></li>
          <li><a href="#" className="d-flex"><p>Travel news</p><p>(10)</p></a></li>
          <li><a href="#" className="d-flex"><p>Modern technology</p><p>(03)</p></a></li>
          <li><a href="#" className="d-flex"><p>Product</p><p>(11)</p></a></li>
          <li><a href="#" className="d-flex"><p>Inspiration</p><p>(21)</p></a></li>
          <li><a href="#" className="d-flex"><p>Health Care</p><p>(21)</p></a></li>
        </ul>
      </aside>

      <aside className="single_sidebar_widget popular_post_widget">
        <h3 className="widget_title">Recent Post</h3>
        {recentPosts.map(skillpost => (
          <RecentPostCard key={skillpost.id} skillpost={skillpost} />
        ))}
      </aside>
    </div>
  );
}

export default SlideBar;
