import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import singleblog1 from "../../assets/clients/img/blog/single_blog_1.png";
import axios from "axios";
import Swal from 'sweetalert2';

function CreatePost() {
  const [media, setMedia] = useState(singleblog1);
  const [mediaType, setMediaType] = useState('image');
  const fileInputRef = useRef(null); // to programmatically trigger file input
  const [user, setUser] = useState({ fullName: "", imageBase64: "" });
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");
  const [p5, setP5] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // for uploading


  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith("video") ? "video" : "image";
      setMediaType(type);
      setMedia(URL.createObjectURL(file));
      setSelectedFile(file); // store file to send to backend
    }
  };


  const triggerFileInput = () => {
    fileInputRef.current.click(); // simulate click on hidden file input
  };
const token = JSON.parse(localStorage.getItem("user"))?.token;

useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user")); // retrieve stored object
  const userId = userData?.id;

  console.log("user Id : ", userId);

  if (userId && token) {
    axios.get(`http://localhost:8086/api/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then((res) => {
      setUser(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch user data:", err);
    });
  }
}, []);


const handleSubmit = async () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;
  const token = userData?.token;

  if (!userId || !token) {
    alert("User not found or not logged in. Please log in again.");
    return;
  }

  const formData = new FormData();

  const skillPost = {
    title,
    summary,
    pargrhap1: p1,
    pargrhap2: p2,
    pargrhap3: p3,
    pargrhap4: p4,
    pargrhap5: p5,
    createdAt: new Date().toISOString(),
    category,
    tags,
    user: {
      id: userId
    }
  };

  formData.append(
    "skillPost",
    new Blob([JSON.stringify(skillPost)], { type: "application/json" })
  );

  if (selectedFile) {
    formData.append("image", selectedFile);
  }

  try {
    const response = await axios.post(
      "http://localhost:8086/api/skillposts/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    Swal.fire({
      title: 'Success!',
      text: 'Post created successfully!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      navigate('/user/viewSkillPost');
    });

  } catch (error) {
    console.error("Error creating skill post:", error);

    Swal.fire({
      title: 'Error!',
      text: 'Failed to create post.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};




  return (
    <div>

      <div className="d-flex justify-content-center">
        <h2 className="mb-4">Create Post</h2>
      </div>

      <div className="single-post">
        <div className="feature-img mb-3" onClick={triggerFileInput} style={{ cursor: 'pointer' }}>
          {mediaType === 'image' ? (
            <img className="img-fluid" src={media} alt="Uploaded" />
          ) : (
            <video className="img-fluid" controls>
              <source src={media} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Hidden input field */}
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleMediaChange}
          style={{ display: 'none' }}
        />

        <div className="blog_details">
          <input type="text" className="form-control mb-3" placeholder="Add Your Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <textarea className="form-control mb-3" rows={3} placeholder="Add Your First Paragraph" value={p1} onChange={(e) => setP1(e.target.value)} />

          <textarea className="form-control mb-3" rows={3} placeholder="Add Your First Paragraph" value={p2} onChange={(e) => setP2(e.target.value)} />

          <div className="quote-wrapper mb-3">
            <textarea className="form-control mb-3" rows={3} placeholder="Add Your First Paragraph" value={p3} onChange={(e) => setP3(e.target.value)} />
          </div>

          <textarea className="form-control mb-3" rows={3} placeholder="Add Your First Paragraph" value={p4} onChange={(e) => setP4(e.target.value)} />

          <textarea className="form-control mb-3" rows={3} placeholder="Add Your First Paragraph" value={p5} onChange={(e) => setP5(e.target.value)} />
        </div>
      </div>

      <div className="blog-author">
        <div className="media align-items-center">
          {user.imageBase64 ? (
            <img
              src={`data:image/jpeg;base64,${user.imageBase64}`}
              alt="author"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
          ) : (
            <img src="/default-avatar.png" alt="default" />
          )}
          <div className="media-body">
            <a href="#">
              <h4>{user.fullName || "Loading..."}</h4>
            </a>
            <textarea className="form-control mb-3" rows={2} placeholder="Add Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-info mt-3" onClick={handleSubmit}>
          Publish
        </button>
      </div>


    </div>
  );
}

export default CreatePost;
