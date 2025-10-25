import React, { useEffect } from 'react';

const OAuthCallback = () => {
  useEffect(() => {
    try {
      const query = new URLSearchParams(window.location.search);
      const provider = query.get('state')?.includes('facebook') ? 'facebook' : 'google';
      const token = query.get('access_token') || query.get('credential') || query.get('code');

      if (token && window.opener) {
        window.opener.postMessage({ provider, token }, window.origin);
        window.close();
      } else {
        console.error('No token found or no opener window');
      }
    } catch (err) {
      console.error('OAuth callback failed', err);
    }
  }, []);

  return <p>Processing login...</p>;
};

export default OAuthCallback;
