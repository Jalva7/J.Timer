import React from 'react';
import './App.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-content">
        <h1>J.Timer</h1>
        <p>Connect your Spotify account to play music during your work sessions</p>
        <a className="login-button" href="http://127.0.0.1:5001/auth/login">
          LOGIN WITH SPOTIFY
        </a>
      </div>
    </div>
  );
}

export default Login;