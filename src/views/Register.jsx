// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const [mode, setMode] = useState('sign-in');
//   const navigate = useNavigate();

//   // Set default mode on mount
//   useEffect(() => {
//     setMode('sign-in');
//   }, []);

//   // Mimic delay for visual mode switch if needed
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setMode('sign-in');
//     }, 200);
//     return () => clearTimeout(timer);
//   }, []);

//   // 💡 One-time refresh to fix CSS conflict
//   useEffect(() => {
//     const refreshTimer = setTimeout(() => {
//       if (performance.navigation.type !== 1) {
//         window.location.reload();
//       }
//     }, 0);

//     return () => clearTimeout(refreshTimer);
//   }, []);

//   const toggle = () => {
//     setMode((prev) => (prev === 'sign-in' ? 'sign-up' : 'sign-in'));
//   };

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     image: null    // rename here
//   });


//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: files ? files[0] : value
//     }));
//   };


//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Client-side validations
//   const { username, email, password, confirmPassword, image } = formData;

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!username.trim()) {
//     return Swal.fire('Error', 'Username is required', 'error');
//   }

//   if (!emailRegex.test(email)) {
//     return Swal.fire('Error', 'Please enter a valid email address', 'error');
//   }

//   if (!image) {
//     return Swal.fire('Error', 'Profile image is required', 'error');
//   }

//   if (password.length < 6) {
//     return Swal.fire('Error', 'Password must be at least 6 characters', 'error');
//   }

//   if (password !== confirmPassword) {
//     return Swal.fire('Error', 'Passwords do not match', 'error');
//   }

//   // Prepare JSON part of the form
//   const userJson = {
//     username: formData.username,
//     email: formData.email,
//     password: formData.password,
//   };

//   const multipartData = new FormData();
//   multipartData.append('user', new Blob([JSON.stringify(userJson)], { type: 'application/json' }));

//   if (formData.image) {
//     multipartData.append('image', formData.image);
//   }

//   try {
//     const response = await fetch('http://localhost:8086/api/user/create', {
//       method: 'POST',
//       body: multipartData,
//     });

//     if (!response.ok) {
//       let errorMessage = 'Registration failed!';
//       try {
//         const errorData = await response.json();
//         errorMessage = errorData.message || errorMessage;
//       } catch {}
//       throw new Error(errorMessage);
//     }

//     Swal.fire('Success', 'Account created successfully!', 'success');

//     setFormData({
//       username: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       image: null,
//     });

//   } catch (error) {
//     Swal.fire('Error', error.message, 'error');
//   }
// };




//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const loginData = {
//       email: formData.email,
//       password: formData.password
//     };

//     try {
//       const response = await axios.post('http://localhost:8086/api/user/login', loginData, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       // Construct user object from response
//       const user = {
//         id: response.data.userId,
//         email: response.data.email,
//         role: response.data.role,
//         token: response.data.token
//       };

//       // Save to localStorage
//       localStorage.setItem('user', JSON.stringify(user));
//       console.log("User data : ", user)

//       Swal.fire('Welcome', 'Login successful!', 'success').then(() => {
//         navigate('/user/home');

//         // Refresh after 0.5 second
//         setTimeout(() => {
//           window.location.reload();
//         }, 500);
//       });

//     } catch (error) {
//       Swal.fire('Login Failed', error.response?.data?.message || 'Invalid credentials', 'error');
//     }
//   };




//   return (
//     <div>
//       <div id="container" className={`container ${mode}`}>
//         {/* FORM SECTION */}
//         <div className="row">
//           {/* SIGN UP */}

//           <div className="col align-items-center flex-col sign-up">
//             <div className="form-wrapper align-items-center">
//               <form className="form sign-up" onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className="input-group">
//                   <i className="bx bxs-user" />
//                   <input type="text" placeholder="Username" name="username" onChange={handleChange} required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bx-mail-send" />
//                   <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-profile" />
//                   <input type="file" name="image" onChange={handleChange} accept="image/*" required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-lock-alt" />
//                   <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-lock-alt" />
//                   <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} required />
//                 </div>
//                 <button type="submit">Sign up</button>
//                 <p>
//                   <span>Already have an account?</span>
//                   <b onClick={toggle} className="pointer">Sign in here</b>
//                 </p>
//               </form>
//             </div>
//           </div>


//           {/* END SIGN UP */}

//           {/* SIGN IN */}
//           <div className="col align-items-center flex-col sign-in">
//             <div className="form-wrapper align-items-center">
//               <div className="form sign-in">
//                 <div className="input-group">
//                   <i className="bx bxs-user" />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     name="email"
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-lock-alt" />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     name="password"
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <button onClick={handleLogin}>Sign in</button>

//                 <p><b>Forgot password?</b></p>
//                 <p>
//                   <span>Don't have an account?</span>
//                   <b onClick={toggle} className="pointer">Sign up here</b>
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* END SIGN IN */}
//         </div>

//         {/* CONTENT SECTION */}
//         <div className="row content-row">
//           <div className="col align-items-center flex-col">
//             <div className="text sign-in">
//               <h2>Welcome</h2>
//             </div>
//             <div className="img sign-in" />
//           </div>
//           <div className="col align-items-center flex-col">
//             <div className="img sign-up" />
//             <div className="text sign-up">
//               <h2>Join with us</h2>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';
// import { FcGoogle } from 'react-icons/fc';
// import { FaFacebookF } from 'react-icons/fa';
// import './Register.css';


// function Register() {
//   const [mode, setMode] = useState('sign-in');
//   const navigate = useNavigate();


//   // Set default mode on mount
//   useEffect(() => {
//     setMode('sign-in');
//   }, []);

//   // Mimic delay for visual mode switch if needed
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setMode('sign-in');
//     }, 200);
//     return () => clearTimeout(timer);
//   }, []);

//   // 💡 One-time refresh to fix CSS conflict
//   useEffect(() => {
//     const refreshTimer = setTimeout(() => {
//       if (performance.navigation.type !== 1) {
//         window.location.reload();
//       }
//     }, 0);

//     return () => clearTimeout(refreshTimer);
//   }, []);

//   const toggle = () => {
//     setMode((prev) => (prev === 'sign-in' ? 'sign-up' : 'sign-in'));
//   };

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     image: null
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: files ? files[0] : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Client-side validations
//     const { username, email, password, confirmPassword, image } = formData;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!username.trim()) {
//       return Swal.fire('Error', 'Username is required', 'error');
//     }

//     if (!emailRegex.test(email)) {
//       return Swal.fire('Error', 'Please enter a valid email address', 'error');
//     }

//     if (!image) {
//       return Swal.fire('Error', 'Profile image is required', 'error');
//     }

//     if (password.length < 6) {
//       return Swal.fire('Error', 'Password must be at least 6 characters', 'error');
//     }

//     if (password !== confirmPassword) {
//       return Swal.fire('Error', 'Passwords do not match', 'error');
//     }

//     // Prepare JSON part of the form
//     const userJson = {
//       username: formData.username,
//       email: formData.email,
//       password: formData.password,
//     };

//     const multipartData = new FormData();
//     multipartData.append('user', new Blob([JSON.stringify(userJson)], { type: 'application/json' }));

//     if (formData.image) {
//       multipartData.append('image', formData.image);
//     }

//     try {
//       const response = await fetch('http://localhost:8086/api/user/create', {
//         method: 'POST',
//         body: multipartData,
//       });

//       if (!response.ok) {
//         let errorMessage = 'Registration failed!';
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch {}
//         throw new Error(errorMessage);
//       }

//       Swal.fire('Success', 'Account created successfully!', 'success');

//       setFormData({
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         image: null,
//       });

//     } catch (error) {
//       Swal.fire('Error', error.message, 'error');
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const loginData = {
//       email: formData.email,
//       password: formData.password
//     };

//     try {
//       const response = await axios.post('http://localhost:8086/api/user/login', loginData, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       // Construct user object from response
//       const user = {
//         id: response.data.userId,
//         email: response.data.email,
//         role: response.data.role,
//         token: response.data.token
//       };

//       // Save to localStorage
//       localStorage.setItem('user', JSON.stringify(user));
//       console.log("User data : ", user)

//       Swal.fire('Welcome', 'Login successful!', 'success').then(() => {
//         navigate('/user/home');

//         // Refresh after 0.5 second
//         setTimeout(() => {
//           window.location.reload();
//         }, 500);
//       });

//     } catch (error) {
//       Swal.fire('Login Failed', error.response?.data?.message || 'Invalid credentials', 'error');
//     }
//   };

//   // ---------------------------
//   // OAuth handlers (Google/Facebook)
//   // ---------------------------

//   const handleGoogleOAuth = async ({ provider, data }) => {
//     // data may contain: credential (id_token) or access_token depending on provider response
//     const token = data?.credential || data?.access_token || data?.id_token || data?.idToken;
//     if (!token) {
//       return Swal.fire('Error', 'Google login failed (no token received)', 'error');
//     }

//     try {
//       // Send token to backend, backend should verify and return LoginResponseDto (userId, email, role, token)
//       const res = await axios.post('http://localhost:8086/api/user/oauth/google', { token }, {
//         headers: { 'Content-Type': 'application/json' }
//       });

//       const response = res.data;
//       const user = {
//         id: response.userId,
//         email: response.email,
//         role: response.role,
//         token: response.token
//       };
//       localStorage.setItem('user', JSON.stringify(user));
//       Swal.fire('Welcome', 'Login successful via Google!', 'success').then(() => {
//         navigate('/user/home');
//         setTimeout(() => window.location.reload(), 500);
//       });
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || err.message || 'Google login failed', 'error');
//     }
//   };

//   const handleFacebookOAuth = async ({ provider, data }) => {
//     const accessToken = data?.accessToken || data?.access_token;
//     if (!accessToken) {
//       return Swal.fire('Error', 'Facebook login failed (no access token)', 'error');
//     }

//     try {
//       const res = await axios.post('http://localhost:8086/api/user/oauth/facebook', { accessToken }, {
//         headers: { 'Content-Type': 'application/json' }
//       });

//       const response = res.data;
//       const user = {
//         id: response.userId,
//         email: response.email,
//         role: response.role,
//         token: response.token
//       };
//       localStorage.setItem('user', JSON.stringify(user));
//       Swal.fire('Welcome', 'Login successful via Facebook!', 'success').then(() => {
//         navigate('/user/home');
//         setTimeout(() => window.location.reload(), 500);
//       });
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || err.message || 'Facebook login failed', 'error');
//     }
//   };

//   // ---------------------------
//   // Render
//   // ---------------------------

//   return (
//     <div>
//       <div id="container" className={`container ${mode}`}>
//         {/* FORM SECTION */}
//         <div className="row">
//           {/* SIGN UP */}
//           <div className="col align-items-center flex-col sign-up">
//             <div className="form-wrapper align-items-center">
//               <form className="form sign-up" onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className="input-group">
//                   <i className="bx bxs-user" />
//                   <input type="text" placeholder="Username" name="username" onChange={handleChange} required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bx-mail-send" />
//                   <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-profile" />
//                   <input type="file" name="image" onChange={handleChange} accept="image/*" required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-lock-alt" />
//                   <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-lock-alt" />
//                   <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} required />
//                 </div>
//                 <button type="submit">Sign up</button>
//                 <p>
//                   <span>Already have an account?</span>
//                   <b onClick={toggle} className="pointer">Sign in here</b>
//                 </p>
//               </form>
//             </div>
//           </div>
//           {/* END SIGN UP */}

//           {/* SIGN IN */}
//           <div className="col align-items-center flex-col sign-in">
//             <div className="form-wrapper align-items-center">
//               <div className="form sign-in">
//                 <div className="input-group">
//                   <i className="bx bxs-user" />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     name="email"
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="input-group">
//                   <i className="bx bxs-lock-alt" />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     name="password"
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <button onClick={handleLogin}>Sign in</button>

//                 {/* OAuth modern buttons (keeps original layout intact) */}
//                 <div className="oauth-area">
//                   <div className="oauth-divider"><span>or continue with</span></div>

//                   <div className="oauth-buttons">
//                     <LoginSocialGoogle
//                       client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
//                       onResolve={handleGoogleOAuth}
//                       onReject={() => Swal.fire('Error', 'Google login failed', 'error')}
//                     >
//                       <button type="button" className="oauth-btn google" aria-label="Sign in with Google">
//                         <FcGoogle className="oauth-icon" size={20} />
//                         <span>Sign in with Google</span>
//                       </button>
//                     </LoginSocialGoogle>

//                     <LoginSocialFacebook
//                       appId={import.meta.env.REACT_APP_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
//                       onResolve={handleFacebookOAuth}
//                       onReject={() => Swal.fire('Error', 'Facebook login failed', 'error')}
//                     >
//                       <button type="button" className="oauth-btn facebook" aria-label="Sign in with Facebook">
//                         <FaFacebookF className="oauth-icon" size={18} />
//                         <span>Sign in with Facebook</span>
//                       </button>
//                     </LoginSocialFacebook>
//                   </div>
//                 </div>

//                 <p><b>Forgot password?</b></p>
//                 <p>
//                   <span>Don't have an account?</span>
//                   <b onClick={toggle} className="pointer">Sign up here</b>
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* END SIGN IN */}
//         </div>

//         {/* CONTENT SECTION */}
//         <div className="row content-row">
//           <div className="col align-items-center flex-col">
//             <div className="text sign-in">
//               <h2>Welcome</h2>
//             </div>
//             <div className="img sign-in" />
//           </div>
//           <div className="col align-items-center flex-col">
//             <div className="img sign-up" />
//             <div className="text sign-up">
//               <h2>Join with us</h2>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebookF } from "react-icons/fa";
// import "./Register.css";

// function Register() {
//   const [mode, setMode] = useState("sign-in");
//   const navigate = useNavigate();

//   // Default mode
//   useEffect(() => setMode("sign-in"), []);

//   // Toggle sign in / sign up
//   const toggle = () => {
//     setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
//   };

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   // --- Registration Handler ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { username, email, password, confirmPassword, image } = formData;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!username.trim()) return Swal.fire("Error", "Username is required", "error");
//     if (!emailRegex.test(email)) return Swal.fire("Error", "Enter valid email", "error");
//     if (!image) return Swal.fire("Error", "Profile image is required", "error");
//     if (password.length < 6)
//       return Swal.fire("Error", "Password must be at least 6 characters", "error");
//     if (password !== confirmPassword)
//       return Swal.fire("Error", "Passwords do not match", "error");

//     const userJson = { username, email, password };
//     const multipartData = new FormData();
//     multipartData.append("user", new Blob([JSON.stringify(userJson)], { type: "application/json" }));
//     multipartData.append("image", image);

//     try {
//       const response = await fetch("http://localhost:8086/api/user/create", {
//         method: "POST",
//         body: multipartData,
//       });

//       if (!response.ok) throw new Error("Registration failed!");

//       Swal.fire("Success", "Account created successfully!", "success");
//       setFormData({ username: "", email: "", password: "", confirmPassword: "", image: null });
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//     }
//   };

//   // --- Normal Login Handler ---
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:8086/api/user/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       const user = {
//         id: res.data.userId,
//         email: res.data.email,
//         role: res.data.role,
//         token: res.data.token,
//       };

//       localStorage.setItem("user", JSON.stringify(user));
//       Swal.fire("Welcome", "Login successful!", "success").then(() => {
//         navigate("/user/home");
//         setTimeout(() => window.location.reload(), 500);
//       });
//     } catch (error) {
//       Swal.fire("Login Failed", error.response?.data?.message || "Invalid credentials", "error");
//     }
//   };

//   // --- Google Login Handler ---
// //   const handleGoogleOAuth = async ({ provider, data }) => {
// //     const token = data?.credential || data?.access_token;
// //     if (!token) return Swal.fire("Error", "Google login failed (no token received)", "error");

// //     try {
// //       //const res = await axios.post("http://localhost:8086/api/user/oauth/google", { token });
// //       const res =axios.post('http://localhost:8086/api/user/oauth/google', { token: token }, {
// //   headers: { 'Content-Type': 'application/json' }
// // });

// //       const response = res.data;

// //       const user = {
// //         id: response.userId,
// //         email: response.email,
// //         role: response.role,
// //         token: response.token,
// //       };

// //       localStorage.setItem("user", JSON.stringify(user));
// //       Swal.fire("Welcome", "Login successful via Google!", "success").then(() => {
// //         navigate("/user/home");
// //         setTimeout(() => window.location.reload(), 500);
// //       });
// //     } catch (err) {
// //       Swal.fire("Error", err.response?.data?.message || err.message, "error");
// //     }
// //   };


// const handleGoogleOAuth = async ({ provider, data }) => {
//   // Only use ID token (credential) for backend verification
//   const idToken = data?.credential;

//   if (!idToken) {
//     return Swal.fire(
//       "Error",
//       "Google login failed (no ID token received). Make sure you are using Google One Tap / Identity Services.",
//       "error"
//     );
//   }

//   try {
//     // Send ID token to backend
//     const res = await axios.post(
//       "http://localhost:8086/api/user/oauth/google",
//       { token: idToken },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     const response = res.data;

//     const user = {
//       id: response.userId,
//       email: response.email,
//       role: response.role,
//       token: response.token,
//     };

//     localStorage.setItem("user", JSON.stringify(user));

//     Swal.fire("Welcome", "Login successful via Google!", "success").then(() => {
//       navigate("/user/home");
//       setTimeout(() => window.location.reload(), 500);
//     });
//   } catch (err) {
//     Swal.fire(
//       "Error",
//       err.response?.data?.message || err.message,
//       "error"
//     );
//   }
// };


//   // --- Facebook Login Handler ---
//   const handleFacebookOAuth = async ({ provider, data }) => {
//     const accessToken = data?.accessToken;
//     if (!accessToken) return Swal.fire("Error", "Facebook login failed (no access token)", "error");

//     try {
//       const res = await axios.post("http://localhost:8086/api/user/oauth/facebook", { accessToken });
//       const response = res.data;

//       const user = {
//         id: response.userId,
//         email: response.email,
//         role: response.role,
//         token: response.token,
//       };

//       localStorage.setItem("user", JSON.stringify(user));
//       Swal.fire("Welcome", "Login successful via Facebook!", "success").then(() => {
//         navigate("/user/home");
//         setTimeout(() => window.location.reload(), 500);
//       });
//     } catch (err) {
//       Swal.fire("Error", err.response?.data?.message || err.message, "error");
//     }
//   };

//   return (
//     <div>
//       <div id="container" className={`container ${mode}`}>
//         {/* SIGN UP */}
//         <div className="row">
//           <div className="col align-items-center flex-col sign-up">
//             <div className="form-wrapper align-items-center">
//               <form className="form sign-up" onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className="input-group">
//                   <input type="text" placeholder="Username" name="username" onChange={handleChange} />
//                 </div>
//                 <div className="input-group">
//                   <input type="email" placeholder="Email" name="email" onChange={handleChange} />
//                 </div>
//                 <div className="input-group">
//                   <input type="file" name="image" onChange={handleChange} accept="image/*" />
//                 </div>
//                 <div className="input-group">
//                   <input type="password" placeholder="Password" name="password" onChange={handleChange} />
//                 </div>
//                 <div className="input-group">
//                   <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} />
//                 </div>
//                 <button type="submit">Sign up</button>
//                 <p>
//                   Already have an account? <b onClick={toggle} className="pointer">Sign in here</b>
//                 </p>
//               </form>
//             </div>
//           </div>

//           {/* SIGN IN */}
//           <div className="col align-items-center flex-col sign-in">
//             <div className="form-wrapper align-items-center">
//               <div className="form sign-in">
//                 <div className="input-group">
//                   <input type="email" placeholder="Email" name="email" onChange={handleChange} />
//                 </div>
//                 <div className="input-group">
//                   <input type="password" placeholder="Password" name="password" onChange={handleChange} />
//                 </div>
//                 <button onClick={handleLogin}>Sign in</button>

//                 <div className="oauth-area">
//                   <div className="oauth-divider"><span>or continue with</span></div>

//                   <div className="oauth-buttons">
//                     <LoginSocialGoogle
//                       client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
//                       redirect_uri={window.location.origin}  // ✅ FIX
//                       onResolve={handleGoogleOAuth}
//                       onReject={() => Swal.fire("Error", "Google login failed", "error")}
//                     >
//                       <button type="button" className="oauth-btn google">
//                         <FcGoogle className="oauth-icon" size={20} />
//                         <span>Sign in with Google</span>
//                       </button>
//                     </LoginSocialGoogle>

//                     <LoginSocialFacebook
//                       appId={import.meta.env.VITE_FACEBOOK_APP_ID}
//                       redirect_uri={window.location.origin}  // ✅ FIX
//                       onResolve={handleFacebookOAuth}
//                       onReject={() => Swal.fire("Error", "Facebook login failed", "error")}
//                     >
//                       <button type="button" className="oauth-btn facebook">
//                         <FaFacebookF className="oauth-icon" size={18} />
//                         <span>Sign in with Facebook</span>
//                       </button>
//                     </LoginSocialFacebook>
//                   </div>
//                 </div>

//                 <p>
//                   Don't have an account? <b onClick={toggle} className="pointer">Sign up here</b>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import "./Register.css";

function Register() {
  const [mode, setMode] = useState("sign-in");
  const navigate = useNavigate();

  useEffect(() => setMode("sign-in"), []);
  const toggle = () => setMode(prev => (prev === "sign-in" ? "sign-up" : "sign-in"));

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { username, email, password, confirmPassword, image } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) return Swal.fire("Error", "Username is required", "error");
    if (!emailRegex.test(email)) return Swal.fire("Error", "Enter valid email", "error");
    if (!image) return Swal.fire("Error", "Profile image is required", "error");
    if (password.length < 6)
      return Swal.fire("Error", "Password must be at least 6 characters", "error");
    if (password !== confirmPassword)
      return Swal.fire("Error", "Passwords do not match", "error");

    const userJson = { username, email, password };
    const multipartData = new FormData();
    multipartData.append("user", new Blob([JSON.stringify(userJson)], { type: "application/json" }));
    multipartData.append("image", image);

    try {
      const response = await fetch("http://localhost:8086/api/user/create", {
        method: "POST",
        body: multipartData,
      });
      if (!response.ok) throw new Error("Registration failed!");
      Swal.fire("Success", "Account created successfully!", "success");
      setFormData({ username: "", email: "", password: "", confirmPassword: "", image: null });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8086/api/user/login", {
        email: formData.email,
        password: formData.password,
      });
      const user = {
        id: res.data.userId,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token,
      };
      localStorage.setItem("user", JSON.stringify(user));
      Swal.fire("Welcome", "Login successful!", "success").then(() => {
        navigate("/user/home");
        setTimeout(() => window.location.reload(), 500);
      });
    } catch (error) {
      Swal.fire("Login Failed", error.response?.data?.message || "Invalid credentials", "error");
    }
  };

  // --- Google OAuth ---
  const handleGoogleOAuth = async response => {
    const idToken = response?.credential;
    if (!idToken) {
      return Swal.fire(
        "Error",
        "Google login failed (no ID token received). Make sure you are using Google One Tap / Identity Services.",
        "error"
      );
    }

    try {
      const res = await axios.post(
        "http://localhost:8086/api/user/oauth/google",
        { token: idToken },
        { headers: { "Content-Type": "application/json" } }
      );
      const user = {
        id: res.data.userId,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token,
      };
      localStorage.setItem("user", JSON.stringify(user));
      Swal.fire("Welcome", "Login successful via Google!", "success").then(() => {
        navigate("/user/home");
        setTimeout(() => window.location.reload(), 500);
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // --- Load Google Identity Services Script ---
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleOAuth,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large", width: 250 }
      );
      window.google.accounts.id.prompt();
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="main-container">
      <div id="container" className={`container ${mode}`}>
        {/* SIGN UP PANEL */}
        <div className="row">
          <div className="col flex-col sign-up">
            <div className="form-wrapper">
              <form className="form sign-up" onSubmit={handleSubmit} encType="multipart/form-data">
                <h2>Join with us</h2>
                <div className="input-group">
                  <input type="text" placeholder="Username" name="username" onChange={handleChange} />
                </div>
                <div className="input-group">
                  <input type="email" placeholder="Email" name="email" onChange={handleChange} />
                </div>
                <div className="input-group">
                  <input type="file" name="image" onChange={handleChange} accept="image/*" />
                </div>
                <div className="input-group">
                  <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                </div>
                <div className="input-group">
                  <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} />
                </div>
                <button type="submit">Sign up</button>
                <p>
                  Already have an account? <b onClick={toggle} className="pointer">Sign in here</b>
                </p>
              </form>
            </div>
          </div>

          {/* SIGN IN PANEL */}
          <div className="col flex-col sign-in">
            <div className="form-wrapper">
              <div className="form sign-in">
                <h2>Welcome Back!</h2>
                <div className="input-group">
                  <input type="email" placeholder="Email" name="email" onChange={handleChange} />
                </div>
                <div className="input-group">
                  <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                </div>
                <button onClick={handleLogin}>Sign in</button>

                <div className="oauth-area">
                  <div className="oauth-divider"><span>or continue with</span></div>
                  <div className="oauth-buttons">
                    <div id="google-signin-button" /> {/* Google button */}
                    <button className="oauth-btn facebook" type="button">
                      <FaFacebookF className="oauth-icon" size={18} />
                      <span>Sign in with Facebook</span>
                    </button>
                  </div>
                </div>

                <p>
                  Don't have an account? <b onClick={toggle} className="pointer">Sign up here</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
