// GameControls.jsx - Configuration panel for themes, symbols, and board sizes
import React from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  RotateCcw
} from 'lucide-react';

const GameControls = ({
  boardSize,
  setBoardSize,
  customSymbols,
  setSymbolPreset,
  soundEnabled,
  setSoundEnabled,
  theme,
  setTheme,
  onResetGame,
  onResetStats
}) => {
  // Preset definitions
  const symbolPresets = [
    { name: 'Classic', x: 'X', o: 'O' },
    { name: 'Cosmic', x: '☀️', o: '🌙' },
    { name: 'Elemental', x: '🔥', o: '❄️' },
    { name: 'Cybernetic', x: '👽', o: '🤖' },
    { name: 'Nature', x: '🌸', o: '🍀' }
  ];

  const currentPresetName = symbolPresets.find(
    p => p.x === customSymbols.X && p.o === customSymbols.O
  )?.name || 'Classic';

  return (
    <div className="panel glass-panel">
      <h3 className="panel-title">
        <Settings size={18} />
        Game Settings
      </h3>

      {/* Board Size */}
      <div className="setting-group">
        <label className="setting-label">Board Size</label>
        <div className="setting-options">
          <button
            className={`btn-control ${boardSize === 3 ? 'active' : ''}`}
            onClick={() => setBoardSize(3)}
          >
            3 x 3
          </button>
          <button
            className={`btn-control ${boardSize === 5 ? 'active' : ''}`}
            onClick={() => setBoardSize(5)}
          >
            5 x 5 (4 win)
          </button>
        </div>
      </div>

      {/* Symbol Skin Picker */}
      <div className="setting-group">
        <label className="setting-label">Symbol Skins</label>
        <div className="symbol-picker">
          {symbolPresets.map((preset) => (
            <button
              key={preset.name}
              className={`btn-picker ${currentPresetName === preset.name ? 'active' : ''}`}
              onClick={() => setSymbolPreset(preset)}
            >
              <span className="pick-preview">
                {preset.x} {preset.o}
              </span>
              <span className="pick-label">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Reset */}
      <button className="btn-control active" onClick={onResetGame} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
        <RotateCcw size={16} />
        Reset Current Match
      </button>

      {/* Bottom Toggles: Audio, Dark Mode, Reset Stats */}
      <div className="system-toggles">
        <button
          className="btn-control"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button
          className="btn-control"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          className="btn-control"
          onClick={onResetStats}
          title="Reset Leaderboard Statistics"
          style={{ color: 'var(--color-o)' }}
        >
          Clear Stats
        </button>
      </div>
    </div>
  );
};

export default GameControls;
