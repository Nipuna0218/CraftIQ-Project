import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// --- Safe MIME sniff for base64 images (JPEG/PNG/WebP only) ---
function sniffImageMimeFromBase64(b64) {
  if (!b64) return null;
  try {
    const bin = atob(b64.replace(/\s+/g, ""));
    const len = bin.length;
    if (len < 12) return null;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
      return "image/jpeg";

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    )
      return "image/png";

    // WebP: "RIFF....WEBP"
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    )
      return "image/webp";

    return null; // reject unknown/SVG/etc.
  } catch {
    return null;
  }
}

function UpdatePost({ skillPost }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({ fullName: "", imageBase64: "" });

  // Destructure and rename imageBase64
  const {
    id,
    title,
    summary,
    pargrhap1,
    pargrhap2,
    pargrhap3,
    pargrhap4,
    pargrhap5,
    imageBase64,
  } = skillPost;

  // Controlled form state
  const [formData, setFormData] = useState({
    title,
    summary,
    pargrhap1,
    pargrhap2,
    pargrhap3,
    pargrhap4,
    pargrhap5,
    imageBase64,
  });

  const [mediaPreview, setMediaPreview] = useState(
    `data:image/jpeg;base64,${imageBase64}`
  );
  const [mediaType, setMediaType] = useState("image");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")); // retrieve stored object
    const userId = userData?.id;
    console.log("user Id : ", userId);

    if (userId) {
      axios
        .get(`http://localhost:8086/api/user/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, []);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith("video") ? "video" : "image";
      setMediaType(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setFormData((prev) => ({ ...prev, imageBase64: base64 }));
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:8086/api/skillposts/${id}`, {
        ...skillPost,
        ...formData,
      });

      console.log("Skill Post Data:", formData);

      Swal.fire({
        title: "Success!",
        text: "Post updated successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Navigate after delay to allow user to see the success message
      setTimeout(() => {
        navigate("/user/viewSkillPost");
      }, 1600);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update post.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h2 className="mb-4">Update Post</h2>
      </div>

      <div className="single-post">
        <div
          className="feature-img mb-3 d-flex justify-content-center"
          onClick={triggerFileInput}
          style={{ cursor: "pointer" }}
        >
          {mediaType === "image" ? (
            <img
              className="img-fluid"
              src={mediaPreview}
              alt="Uploaded"
              style={{ width: "980px", height: "480px", objectFit: "cover" }}
            />
          ) : (
            <video
              className="img-fluid"
              controls
              style={{ width: "980px", height: "480px", objectFit: "cover" }}
            >
              <source src={mediaPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleMediaChange}
          style={{ display: "none" }}
        />

        <div className="blog_details">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
            className="form-control mb-3"
            placeholder="Title"
          />

          <textarea
            name="pargrhap1"
            value={formData.pargrhap1}
            onChange={handleChange}
            className="form-control mb-3"
            rows={3}
            placeholder="Paragraph 1"
          />

          <textarea
            name="pargrhap2"
            value={formData.pargrhap2}
            onChange={handleChange}
            className="form-control mb-3"
            rows={2}
            placeholder="Paragraph 2"
          />

          {/* Highlighted style for pargrhap_3 */}
          <div className="quote-wrapper mb-3">
            <textarea
              name="pargrhap3"
              value={formData.pargrhap3}
              onChange={handleChange}
              className="form-control"
              rows={2}
              placeholder="Paragraph 3"
            ></textarea>
          </div>

          <textarea
            name="pargrhap4"
            value={formData.pargrhap4}
            onChange={handleChange}
            className="form-control mb-3"
            rows={2}
            placeholder="Paragraph 4"
          />

          <textarea
            name="pargrhap5"
            value={formData.pargrhap5}
            onChange={handleChange}
            className="form-control mb-3"
            rows={2}
            placeholder="Paragraph 5"
          />
        </div>
      </div>
      <div className="blog-author">
        <div className="media align-items-center">
          {(() => {
            const mime = sniffImageMimeFromBase64(user.imageBase64);
            const safeSrc = mime
              ? `data:${mime};base64,${user.imageBase64}`
              : null;
            return (
              <img
                src={safeSrc || "/default-avatar.png"}
                alt="author"
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />
            );
          })()}
          <div className="media-body">
            <a href="#">
              <h4>{user.fullName || "Loading..."}</h4>
            </a>
            <textarea
              className="form-control mb-3"
              rows={2}
              placeholder="Add Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <button onClick={handleSubmit} className="btn btn-info mt-3">
          Publish Update
        </button>
      </div>
    </div>
  );
}

export default UpdatePost;
