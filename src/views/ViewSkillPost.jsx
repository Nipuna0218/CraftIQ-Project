import React, { useEffect, useState } from 'react';
import AllSkillPost from '../components/skillPost/AllSkillPost';
import axios from 'axios';
import Swal from 'sweetalert2';
function ViewSkillPost() {
  const [userSkillPosts, setUserSkillPosts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));
 const token = JSON.parse(localStorage.getItem("user"))?.token;
  useEffect(() => {
    fetchPosts();
  }, [currentUser?.id]);

const fetchPosts = () => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  axios.get('http://localhost:8086/api/skillposts/', { headers })
    .then(response => {
      const filtered = response.data
        .filter(post => post.user?.id === currentUser?.id)
        .map(post => ({
          id: post.id,
          img: post.imageBase64 ? `data:image/jpeg;base64,${post.imageBase64}` : '',
          title: post.title,
          summary: post.summary,
          pargrhap_1: post.pargrhap1,
          pargrhap_2: post.pargrhap2,
          pargrhap_3: post.pargrhap3,
          pargrhap_4: post.pargrhap4,
          pargrhap_5: post.pargrhap5,
          category: post.category || 'General',
          date: new Date(post.createdAt),
          user: post.user
        }));
      setUserSkillPosts(filtered);
    })
    .catch(error => {
      console.error('Error fetching skill posts:', error);
    });
};

 const handleDeletePost = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This action cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`http://localhost:8086/api/skillposts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setUserSkillPosts(prev => prev.filter(post => post.id !== id));

    Swal.fire({
      title: 'Deleted!',
      text: 'Your skill post has been deleted.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Failed to delete post", error);
    Swal.fire({
      title: 'Error!',
      text: 'Could not delete the skill post.',
      icon: 'error',
    });
  }
};

  return (
    <div>
      <h3 className="mb-3 mt-30 text-center">Your All Posts</h3>
      {userSkillPosts.map(skillPost => (
        <AllSkillPost key={skillPost.id} skillPost={skillPost} onDelete={handleDeletePost} />
      ))}
    </div>
  );
}

export default ViewSkillPost;
