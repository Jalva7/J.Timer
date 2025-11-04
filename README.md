# J.Timer 💜🎵

A retro-styled Pomodoro timer with integrated Spotify playback. Stay productive with the Pomodoro Technique while enjoying your favorite music!

![J.Timer](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-19.2.0-lightblue)
![Node.js](https://img.shields.io/badge/Node.js-22.16.0-lavender)

## 🌐 Live Demo

**Frontend:** [https://jalva7.github.io/J.Timer/](https://jalva7.github.io/J.Timer/)  
**Backend:** [https://j-timer.onrender.com](https://j-timer.onrender.com)

## ✨ Features

- **Pomodoro Timer**: Customizable work sessions, short breaks, and long breaks
- **Task Management**: Create, complete, and delete tasks to stay organized
- **Spotify Integration**: Control your Spotify playback directly from the timer
- **Progress Tracking**: Visual indicators for completed Pomodoros
- **Audio Alerts**: Customizable alarm sound when timer completes
- **Persistent Settings**: Your preferences and tasks are saved locally
- **Retro UI**: Nostalgic design with a modern twist

## 🎯 How to Use

1. **Set Your Timer**: Choose between Work (default 25 min), Short Break (5 min), or Long Break (15 min)
2. **Add Tasks**: Keep track of what you need to accomplish
3. **Login to Spotify**: Connect your Spotify account to play music while you work
4. **Start Working**: Hit the START button and focus on your task
5. **Take Breaks**: After 4 Pomodoros, you'll automatically get a long break

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.0
- **Lucide React** - Icons
- **use-sound** - Audio playback
- **Axios** - HTTP requests
- Deployed on **GitHub Pages**

### Backend

- **Express.js** 5.1.0
- **Spotify Web API** - Music integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration
- Deployed on **Render**

## 🚀 Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spotify Developer Account

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/Jalva7/J.Timer.git
cd J.Timer
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd server
npm install
cd ..
```

4. **Set up Spotify Developer App**

   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add redirect URI: `http://127.0.0.1:5001/auth/callback`
   - Copy your Client ID and Client Secret

5. **Configure environment variables**

Create `server/.env`:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
PORT=5001
```

6. **Run the development servers**

Terminal 1 (Backend):

```bash
cd server
npm start
```

Terminal 2 (Frontend):

```bash
npm start
```

7. **Open your browser**

```
http://localhost:3000
```

## 📁 Project Structure

```
J.Timer/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── sounds/          # Audio files
│   ├── App.js          # Main application
│   ├── config.js       # API configuration
│   └── App.css         # Styles
├── server/
│   ├── index.js        # Express server
│   ├── package.json    # Server dependencies
│   └── .env            # Environment variables (gitignored)
├── package.json        # Frontend dependencies
└── render.yaml         # Render deployment config
```

## 🌍 Deployment

### Frontend (GitHub Pages)

```bash
npm run deploy
```

### Backend (Render)

- Connected to GitHub repository
- Auto-deploys on push to `main` branch
- Configured via `render.yaml`

**Important:** Add production redirect URI to Spotify Dashboard:

```
https://j-timer.onrender.com/auth/callback
```

## 🎨 Customization

### Timer Settings

- Work Time: 1-60 minutes
- Short Break: 1-30 minutes
- Long Break: 1-60 minutes

All settings are saved to localStorage and persist across sessions.

## 🔧 Configuration

### Environment Variables

**Server (.env)**

- `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)

### CORS Configuration

The backend allows requests from:

- `https://jalva7.github.io` (Production)
- `http://localhost:3000` (Development)

## 🐛 Troubleshooting

### Spotify Login Not Working

- Verify redirect URIs in Spotify Developer Dashboard
- Check that environment variables are set correctly
- Ensure backend is running and accessible

### Timer Not Starting

- Check browser console for errors
- Verify localStorage is enabled
- Clear cache and reload

### API Connection Issues

- Confirm backend is deployed and running
- Check CORS configuration
- Verify API URLs in `config.js`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Jalva7**

- GitHub: [@Jalva7](https://github.com/Jalva7)

## 🙏 Acknowledgments

- Pomodoro Technique® by Francesco Cirillo
- Spotify Web API
- React community
- Lucide Icons

## 📮 Contact

Have questions or suggestions? Feel free to open an issue or reach out!

---

Made with 💜 and ☕️ | Powered by the Pomodoro Technique
