//import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Check } from 'lucide-react';
import './App.css';

export default function PixelPomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const workTime = 25;
  const shortBreakTime = 5;
  const longBreakTime = 15;

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
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
  }, [isActive, minutes, seconds, mode, completedPomodoros]);

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

        {/* Main Timer Card */}
        <div className={`timer-card ${mode}`}>
          <div className="timer-inner">
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
              </div>
            </div>
          </div>

          {/* Task Panel */}
          <div className="task-panel">
            <div className="task-panel-inner">
              <h2 className="task-title">TASKS</h2>
              
              {/* Add Task Input */}
              <div className="task-input-container">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a task..."
                  className="task-input"
                  maxLength={50}
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

          {/* Footer Info */}
          <div className="footer">
            <p>🎮 RETRO PRODUCTIVITY 🎮</p>
            <p>Work: 25min | Short Break: 5min | Long Break: 15min</p>
          </div>
        </div>
      </div>
  );
}

