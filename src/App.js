import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Check, Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';
import alarmSound from './sounds/dream-memory-alarm.mp3';
import SpotifyPlayer from './SpotifyPlayer';
import Login from './Login';
import config from './config';

function App() {
  const spotifyPlayerRef = useRef(null);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('isMuted');
    return saved ? JSON.parse(saved) : false;
  });

  const [completedPomodoros, setCompletedPomodoros] = useState(() => {
    const saved = localStorage.getItem('completedPomodoros');
    return saved ? parseInt(saved) : 0;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState('');

  const [workTime, setWorkTime] = useState(() => {
    const saved = localStorage.getItem('workTime');
    return saved ? parseInt(saved) : 25;
  });

  const [shortBreakTime, setShortBreakTime] = useState(() => {
    const saved = localStorage.getItem('shortBreakTime');
    return saved ? parseInt(saved) : 5;
  });

  const [longBreakTime, setLongBreakTime] = useState(() => {
    const saved = localStorage.getItem('longBreakTime');
    return saved ? parseInt(saved) : 15;
  });

  const [showSettings, setShowSettings] = useState(false);

  //Sound Stuff
  const [playAlarm, {stop: stopAlarm}] = useSound(alarmSound, { 
    volume: isMuted ? 0 : 0.5,
    onend: () => setIsAlarmPlaying(false),
  });
  
  useEffect(() => {
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save completed pomodoros
  useEffect(() => {
    localStorage.setItem('completedPomodoros', completedPomodoros.toString());
  }, [completedPomodoros]);

  // Save time settings
  useEffect(() => {
    localStorage.setItem('workTime', workTime.toString());
  }, [workTime]);

  useEffect(() => {
    localStorage.setItem('shortBreakTime', shortBreakTime.toString());
  }, [shortBreakTime]);

  useEffect(() => {
    localStorage.setItem('longBreakTime', longBreakTime.toString());
  }, [longBreakTime]);


  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {

            if (spotifyPlayerRef.current) {
              // Pause playback when timer ends
              spotifyPlayerRef.current.pauseForAlarm();
            }
            if(!isMuted) {
              playAlarm();
              setIsAlarmPlaying(true);
            }
            // Timer complete
            setIsActive(false);
            if (mode === 'work') {
              const newCount = completedPomodoros + 1;
              setCompletedPomodoros(newCount);
              // After 4 pomodoros, take a long break
              if (newCount % 4 === 0) {
                setMode('longBreak');
                setMinutes(longBreakTime);
              } else {
                setMode('shortBreak');
                setMinutes(shortBreakTime);
              }
            } else {
              setMode('work');
              setMinutes(workTime);
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, completedPomodoros, workTime, shortBreakTime, longBreakTime, playAlarm, isMuted]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(workTime);
    } else if (mode === 'shortBreak') {
      setMinutes(shortBreakTime);
    } else {
      setMinutes(longBreakTime);
    }
    setSeconds(0);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'work') {
      setMinutes(workTime);
    } else if (newMode === 'shortBreak') {
      setMinutes(shortBreakTime);
    } else {
      setMinutes(longBreakTime);
    }
    setSeconds(0);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTaskComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  }

  const stopAlarmAndReset = () => {
    stopAlarm();
    setIsAlarmPlaying(false);
    resetTimer();
  }


  const [token, setToken] = useState('');
  
  useEffect(() => {

    async function getToken() {
      try {
        const response = await fetch(`${config.apiUrl}/auth/token`);

        if(!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setToken(json.access_token);
      } catch(error) {
        console.error('Error fetching token:', error);
        setToken('');
      }
    }
        
    getToken();
      
  }, []);  


  return (
    <div className="pomodoro-container">
      <div className="pomodoro-content">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            J.Timer
          </h1>
          <div className="progress-dots">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className={`dot ${i < completedPomodoros % 4 ? 'completed' : ''}`}
              />
            ))}
          </div>
          <p className="completed-count">COMPLETED: {completedPomodoros}</p>
        </div>

        {/* Timer and Task Section */}
        <div className="timer-task-section">
          {/* Main Timer Card */}
          <div className={`timer-card ${mode}`}>
            {/* Mode Selector */}
            <div className="mode-selector">
              <button
                onClick={() => switchMode('work')}
                className={`mode-button ${mode === 'work' ? 'active' : ''}`}
              >
                WORK
              </button>
              <button
                onClick={() => switchMode('shortBreak')}
                className={`mode-button ${mode === 'shortBreak' ? 'active' : ''}`}
              >
                SHORT
              </button>
              <button
                onClick={() => switchMode('longBreak')}
                className={`mode-button ${mode === 'longBreak' ? 'active' : ''}`}
              >
                LONG
              </button>
            </div>

            {/* Mode Display */}
            <div className="mode-display">
              <p className="mode-text">
                {mode === 'work' ? 'WORK TIME' : mode === 'shortBreak' ? 'SHORT BREAK' : 'LONG BREAK'}
              </p>
            </div>

            {/* Timer Display */}
            <div className="timer-display">
              <div className="timer-digits">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>

            {/* Controls */}
            <div className="controls">
              {isAlarmPlaying ? (
                <button
                  onClick={stopAlarmAndReset}
                  className='control-button stop-alarm'
                  >
                    <RotateCcw size={20} />
                    <span>STOP ALARM</span>
                  </button>
              ) : (
              <>
              <button
                onClick={toggleTimer}
                className="control-button start-pause"
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
                <span>{isActive ? 'PAUSE' : 'START'}</span>
              </button>
              <button
                onClick={resetTimer}
                className="control-button reset"
              >
                <RotateCcw size={20} />
                <span>RESET</span>
              </button>
            </>
          )}

              {/* Mute Button */}
              <button 
                onClick={toggleMute} 
                className="mute-button"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>

          {/* Task Panel */}
          <div className="task-panel">
            <div className="task-panel-inner">
              <h2 className="task-title">TASKS</h2>
              
              {/* Add Task Input */}
              <div className="task-input-container">
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a task..."
                  className="task-input"
                  rows="3"                
                />
                <button onClick={addTask} className="add-task-button">
                  <Plus size={16} />
                </button>
              </div>

              {/* Task List */}
              <div className="task-list">
                {tasks.length === 0 ? (
                  <p className="empty-tasks">No tasks yet. Add one!</p>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="task-check"
                      >
                        {task.completed && <Check size={16} />}
                      </button>
                      <span className="task-text">{task.text}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="task-delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Task Stats */}
              {tasks.length > 0 && (
                <div className="task-stats">
                  <span>{tasks.filter(t => t.completed).length}/{tasks.length} DONE</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Settings and Spotify */}
        <div className="bottom-section">
          <div className="bottom-section-grid">
            {/* Settings Panel */}
            <div className="settings-section">
              <button 
                className="settings-toggle" 
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? 'HIDE SETTINGS' : 'SHOW SETTINGS'}
              </button>
              
              {showSettings && (
                <div className="settings-panel">
                  <div className="setting-item">
                    <label>Work Time (minutes):</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={workTime}
                      onChange={(e) => {
                        const value = Math.min(60, Math.max(1, parseInt(e.target.value) || 1));
                        setWorkTime(value);
                        if (mode === 'work') {
                          setMinutes(value);
                          setSeconds(0);
                        }
                      }}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Short Break (minutes):</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={shortBreakTime}
                      onChange={(e) => {
                        const value = Math.min(30, Math.max(1, parseInt(e.target.value) || 1));
                        setShortBreakTime(value);
                        if (mode === 'shortBreak') {
                          setMinutes(value);
                          setSeconds(0);
                        }
                      }}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Long Break (minutes):</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={longBreakTime}
                      onChange={(e) => {
                        const value = Math.min(60, Math.max(1, parseInt(e.target.value) || 1));
                        setLongBreakTime(value);
                        if (mode === 'longBreak') {
                          setMinutes(value);
                          setSeconds(0);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className='spotify-container'>
              { (token === '')? <Login/> :<SpotifyPlayer token={token} /> }
            </div>
          </div>

          {/* Footer Info */}
          <div className="footer">
            <p>RETRO PRODUCTIVITY</p>
            <p>Work: {workTime} min | Short Break: {shortBreakTime} min | Long Break: {longBreakTime} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

/* PUBLIC_URL=https://jalva7.github.io/J.Timer npm run build, npm run deploy */