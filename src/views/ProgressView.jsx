import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#FF8042']; // Followers = Blue, Following = Orange

function ProgressView() {
  const [userStats, setUserStats] = useState(null);
  const [skillPostFeedbacks, setSkillPostFeedbacks] = useState(null);
  const [skillPostLikes, setSkillPostLikes] = useState(null);

  useEffect(() => {
    const fetchUserAndSkillPostData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id || !user.token) {
          console.error('No valid user in localStorage');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };

        // 1. Fetch user data including skillPosts
        const userResponse = await axios.get(`http://localhost:8086/api/user/${user.id}`, config);
        const { followers, following, skillPosts } = userResponse.data;

        // Set Pie chart data
        setUserStats([
          { name: 'Followers', count: followers?.length || 0 },
          { name: 'Following', count: following?.length || 0 }
        ]);

        if (!skillPosts || skillPosts.length === 0) {
          setSkillPostFeedbacks([]);
          setSkillPostLikes([]);
          return;
        }

        // 2. Fetch detailed post data for feedbacks
        const skillPostDetailPromises = skillPosts.map(post =>
          axios.get(`http://localhost:8086/api/skillposts/${post.id}`, config)
        );

        const skillPostDetails = await Promise.all(skillPostDetailPromises);

        const feedbackChartData = skillPostDetails.map(res => {
          const post = res.data;
          return {
            name: post.title || 'Unknown',
            feedbacks: post.feedbacks ? post.feedbacks.length : 0
          };
        });
        setSkillPostFeedbacks(feedbackChartData);

        // 3. Fetch like count for each post
        const likeCountPromises = skillPosts.map(post =>
          axios.get(`http://localhost:8086/api/likes/count?postId=${post.id}`, config)
        );

        const likeCountResults = await Promise.all(likeCountPromises);

        const likeChartData = skillPosts.map((post, index) => ({
          name: post.title || 'Unknown',
          likes: likeCountResults[index].data || 0
        }));

        setSkillPostLikes(likeChartData);

      } catch (error) {
        console.error('Failed to fetch user or skill post data:', error);
      }
    };

    fetchUserAndSkillPostData();
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '40px' }}>
      
      {/* Pie Chart */}
      <div>
        <h3>Pie Chart - Followers vs Following</h3>
        {userStats ? (
          <PieChart width={400} height={400}>
            <Pie
              data={userStats}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {userStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      {/* Bar Chart - Feedbacks */}
      <div>
        <h3>Bar Chart - Feedback Count on Your Skill Posts</h3>
        {skillPostFeedbacks ? (
          skillPostFeedbacks.length > 0 ? (
            <BarChart width={700} height={400} data={skillPostFeedbacks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="feedbacks" fill="#0088FE" />
            </BarChart>
          ) : (
            <p>You don't have any skill posts yet.</p>
          )
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      {/* Bar Chart - Likes */}
      <div>
        <h3>Bar Chart - Like Count on Your Skill Posts</h3>
        {skillPostLikes ? (
          skillPostLikes.length > 0 ? (
            <BarChart width={700} height={400} data={skillPostLikes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" fill="#FF8042" />
            </BarChart>
          ) : (
            <p>No likes data available.</p>
          )
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

    </div>
  );
}

export default ProgressView;
