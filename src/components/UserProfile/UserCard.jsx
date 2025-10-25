import React, { useEffect, useState } from "react";
import axios from "axios";

// --- Minimal helper: allow only real JPEG/PNG/WebP by magic bytes ---
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

    return null; // reject SVG/unknown
  } catch {
    return null;
  }
}

function UserCard() {
  const [userData, setUserData] = useState(null);
  const [imageSrc, setImageSrc] = useState("https://via.placeholder.com/150");
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    let objectUrl = null;

    axios
      .get(`http://localhost:8086/api/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);

        const mime = sniffImageMimeFromBase64(res.data.imageBase64);
        if (mime) {
          const byteChars = atob(res.data.imageBase64);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mime });
          objectUrl = URL.createObjectURL(blob);
          setImageSrc(objectUrl);
        }
      })
      .catch((err) => console.error("Failed to fetch user data:", err));

    // Cleanup: revoke blob URL to prevent memory leak
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={imageSrc}
            alt="Admin"
            className="rounded-circle"
            width={150}
            height={150}
          />
          <div className="mt-3">
            <h4>{userData.fullName || " "}</h4>
            <p className="text-secondary mb-1">{userData.category || " "}</p>
            <p className="text-muted font-size-sm">{userData.address || ""}</p>
            <p className="text-muted font-size-sm">
              Followers :{" "}
              {Array.isArray(userData.followers)
                ? userData.followers.length
                : 0}
            </p>
            <p className="text-muted font-size-sm">
              Following :{" "}
              {Array.isArray(userData.following)
                ? userData.following.length
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
