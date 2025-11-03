const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://j-timer.onrender.com'
    : '',  // Empty string will use the proxy in development
  authUrl: process.env.NODE_ENV === 'production'
    ? 'https://j-timer.onrender.com/auth'
    : '/auth'  // This will use the proxy in development
};

export default config;