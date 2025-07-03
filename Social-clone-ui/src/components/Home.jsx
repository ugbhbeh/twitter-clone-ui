import React from 'react';

function Home({ isAuthenticated }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Home</h1>
      <p>{isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
    </div>
  );
}

export default Home;
