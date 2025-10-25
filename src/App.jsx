import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function App() {
useEffect(() => {
  const interceptor = axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log('Auth header added:', config.headers.Authorization);  // <-- Debug
    } else {
      console.log('No token found');
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return () => {
    axios.interceptors.request.eject(interceptor);
  };
}, []);


  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
