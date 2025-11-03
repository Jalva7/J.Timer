const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://j-timer.onrender.com'
    : 'http://localhost:5001',
  authUrl: process.env.NODE_ENV === 'production'
    ? 'https://j-timer.onrender.com/auth'
    : 'http://localhost:5001/auth'
};

export default config;