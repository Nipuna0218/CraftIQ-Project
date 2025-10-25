import React, { useEffect, useState } from "react";
import axios from "axios";

import AllPost from "../components/skillPost/AllPost";
import SlideBar from "../components/SlideBar";

function Home() {
  const [allSkillPosts, setAllSkillPosts] = useState([]);

 useEffect(() => {
 const token = JSON.parse(localStorage.getItem("user"))?.token;
  axios
    .get("http://localhost:8086/api/skillposts/", {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token here
      },
    })
    .then((response) => {
      const formatted = response.data.map((post) => ({
        id: post.id,
        img: post.imageBase64
          ? `data:image/jpeg;base64,${post.imageBase64}`
          : "",
        title: post.title,
        summary: post.summary,
        pargrhap1: post.pargrhap1,
        pargrhap2: post.pargrhap2,
        pargrhap3: post.pargrhap3,
        pargrhap4: post.pargrhap4,
        pargrhap5: post.pargrhap5,
        username: post.user?.username || "General",
        commentCount: Array.isArray(post.feedbacks) ? post.feedbacks.length : 0,
        date: [
          {
            day: new Date(post.createdAt).getDate(),
            month: new Date(post.createdAt).toLocaleString("default", {
              month: "short",
            }),
          },
        ],
        user: post.user,
      }));
      setAllSkillPosts(formatted);
    })
    .catch((error) => {
      console.error("Error fetching all skill posts:", error);
    });
}, []);

  return (
    <div>
      <section className="blog_area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-5 mb-lg-0">
              {allSkillPosts.map((skillpost) => (
                <AllPost key={skillpost.id} skillpost={skillpost} />
              ))}
            </div>
            <div className="col-lg-4">
              <SlideBar />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
