import React, { useEffect, useState } from "react";
import axios from "axios";

function UserCard() {
  const [userData, setUserData] = useState(null);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    axios
      .get(`http://localhost:8086/api/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, [token]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Use backend image URL if available, otherwise use placeholder
  const FALLBACK_IMG = "https://via.placeholder.com/150";
  const imageSrc = userData.hasImage
    ? `http://localhost:8086/api/user/${userData.id}/image`
    : FALLBACK_IMG;

  // Sanitize/validate image URLs before using them in the DOM to prevent
  // DOM-based XSS (e.g. javascript: or data:text/html). Allow only:
  // - absolute http(s) URLs
  // - relative URLs (starting with /, ./, ../)
  // - data URLs only when they are image data (data:image/...;base64,)
  function safeImageSrc(raw) {
    try {
      if (!raw) return FALLBACK_IMG;
      const s = String(raw).trim();

      // data: URLs - allow only image data (png/jpg/gif/webp/jpeg)
      if (s.toLowerCase().startsWith("data:")) {
        const lower = s.toLowerCase();
        if (/^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(lower)) {
          return s;
        }
        return FALLBACK_IMG;
      }

      // Relative URLs (safe when resolved) - allow. Resolve against the
      // origin only (not the full document location) to avoid using
      // attacker-controllable path/query fragments from window.location.href.
      if (s.startsWith("/") || s.startsWith("./") || s.startsWith("../")) {
        // Resolve relative against the page origin (scheme + host + port)
        const resolved = new URL(s, window.location.origin);
        if (resolved.protocol === "http:" || resolved.protocol === "https:") {
          return resolved.href;
        }
        return FALLBACK_IMG;
      }

      // Absolute URL - allow only http(s)
      const url = new URL(s);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.href;
      }
      return FALLBACK_IMG;
    } catch (err) {
      // Any error parsing the URL -> fallback
      return FALLBACK_IMG;
    }
  }

  const safeSrc = safeImageSrc(imageSrc);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={safeSrc}
            alt={userData.fullName ? `${userData.fullName} avatar` : "User"}
            className="rounded-circle"
            width={150}
            height={150}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
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
