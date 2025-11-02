import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Smartphone } from 'lucide-react';
import './SpotifyPlayer.css';

const SpotifyPlayer = forwardRef(({ token }, ref) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [devices, setDevices] = useState([]);
  const [showDevices, setShowDevices] = useState(false);
  const [error, setError] = useState(null);
  const [wasPlayingBeforePause, setWasPlayingBeforePause] = useState(false);

  useImperativeHandle(ref, () => ({
    pauseForAlarm: async () => {
        if (isPlaying) {
            setWasPlayingBeforePause(true);
            await pausePlayback();
        } else {
            setWasPlayingBeforePause(false);
        }
    },
    resumeAfterAlarm: async () => {
        if (wasPlayingBeforePause) {
            await resumePlayback();
            setWasPlayingBeforePause(false);
        }
    }
}));

  const pausePlayback = async () => {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.ok || response.status === 204) {
            setIsPlaying(false);
        }
    } catch (err) {
        console.error('Error pausing playback:', err);
    }
};

const resumePlayback = async () => {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok || response.status === 204) {
            setIsPlaying(true);
        }
    } catch (err) {
        console.error('Error resuming playback:', err);
    }
};



  // Fetch currently playing track
  const fetchCurrentTrack = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        setCurrentTrack(null);
        setIsPlaying(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCurrentTrack(data.item);
        setIsPlaying(data.is_playing);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching current track:', err);
      setError('Failed to fetch current track');
    }
  };

  // Fetch available devices
  const fetchDevices = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  // Play/Pause
  const togglePlayback = async () => {
    try {
      const endpoint = isPlaying 
        ? 'https://api.spotify.com/v1/me/player/pause'
        : 'https://api.spotify.com/v1/me/player/play';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 204) {
        setIsPlaying(!isPlaying);
        setTimeout(fetchCurrentTrack, 300);
      }
    } catch (err) {
      console.error('Error toggling playback:', err);
      setError('Failed to toggle playback');
    }
  };

  // Skip to next track
  const skipToNext = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 204) {
        setTimeout(fetchCurrentTrack, 500);
      }
    } catch (err) {
      console.error('Error skipping track:', err);
    }
  };

  // Skip to previous track
  const skipToPrevious = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 204) {
        setTimeout(fetchCurrentTrack, 500);
      }
    } catch (err) {
      console.error('Error going to previous track:', err);
    }
  };

  // Transfer playback to device
  const transferPlayback = async (deviceId) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: true
        })
      });

      if (response.ok || response.status === 204) {
        setShowDevices(false);
        setTimeout(fetchCurrentTrack, 500);
      }
    } catch (err) {
      console.error('Error transferring playback:', err);
    }
  };

  // Poll for current track updates
  useEffect(() => {
    if (!token) return;

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 3000);

    return () => clearInterval(interval);
  }, [token]);

  // Fetch devices when showing device list
  useEffect(() => {
    if (showDevices) {
      fetchDevices();
    }
  }, [showDevices]);

  if (!currentTrack) {
    return (
      <div className="spotify-player">
        <div className="spotify-no-playback">
          <p><b>No active playback</b></p>
          <p>Start playing music on Spotify to control it here</p>
          <button 
            className="spotify-devices-btn"
            onClick={() => setShowDevices(!showDevices)}
          >
            <Smartphone size={16} />
            <span>Select Device</span>
          </button>
          
          {showDevices && (
            <div className="spotify-devices-list">
              <h3>Available Devices</h3>
              {devices.length === 0 ? (
                <p>No devices found. Open Spotify on a device first.</p>
              ) : (
                devices.map(device => (
                  <button
                    key={device.id}
                    className={`device-item ${device.is_active ? 'active' : ''}`}
                    onClick={() => transferPlayback(device.id)}
                  >
                    <span>{device.name}</span>
                    <span className="device-type">{device.type}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="spotify-player">
      <div className="spotify-player-content">
        <img 
          src={currentTrack.album.images[0]?.url} 
          alt={currentTrack.name}
          className="spotify-album-art"
        />
        
        <div className="spotify-track-info">
          <div className="spotify-track-name">{currentTrack.name}</div>
          <div className="spotify-artist-name">
            {currentTrack.artists.map(artist => artist.name).join(', ')}
          </div>
        </div>

        <div className="spotify-controls">
          <button 
            className="spotify-control-btn"
            onClick={skipToPrevious}
            title="Previous"
          >
            <SkipBack size={20} />
          </button>

          <button 
            className="spotify-control-btn spotify-play-btn"
            onClick={togglePlayback}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button 
            className="spotify-control-btn"
            onClick={skipToNext}
            title="Next"
          >
            <SkipForward size={20} />
          </button>

          <button 
            className="spotify-control-btn"
            onClick={() => setShowDevices(!showDevices)}
            title="Devices"
          >
            <Smartphone size={20} />
          </button>
        </div>

        {showDevices && (
          <div className="spotify-devices-list">
            <h3>Available Devices</h3>
            {devices.length === 0 ? (
              <p>No devices found</p>
            ) : (
              devices.map(device => (
                <button
                  key={device.id}
                  className={`device-item ${device.is_active ? 'active' : ''}`}
                  onClick={() => transferPlayback(device.id)}
                >
                  <span>{device.name}</span>
                  <span className="device-type">{device.type}</span>
                  {device.is_active && <span className="active-badge">Active</span>}
                </button>
              ))
            )}
          </div>
        )}

        {error && <div className="spotify-error">{error}</div>}
      </div>
    </div>
  );
});

export default SpotifyPlayer;