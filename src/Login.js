import React from 'react';
import './App.css';
import config from './config';

function Login() {
  return (
    <div className="login-container">
      <div className="login-content">
        <h1>J.Timer</h1>
        <p>Connect your Spotify account to play music during your work sessions</p>
        <a className="login-button" href={`${config.authUrl}/login`}>
          LOGIN WITH SPOTIFY
        </a>
      </div>
    </div>
  );
}

export default Login;