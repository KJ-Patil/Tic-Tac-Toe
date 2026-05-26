// App.jsx - Main controller coordinating layout, game state, history, and theme settings (Local 2-Player)
import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import GameControls from './components/GameControls';
import Leaderboard from './components/Leaderboard';
import SoundManager from './utils/SoundManager';
import { checkWinner } from './utils/gameLogic';
import { History, Moon, Sun, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const App = () => {
  // 1. Core States
  const [boardSize, setBoardSize] = useState(3);
  
  // Game History
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), lastMove: null }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  // Appearance & Audio Settings
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tictactoe_theme') || 'dark';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('tictactoe_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Custom Symbol Skins (Preset initially to Classic)
  const [customSymbols, setCustomSymbols] = useState({ X: 'X', O: 'O' });

  // Leaderboard Statistics
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('tictactoe_stats');
    return saved ? JSON.parse(saved) : { xWins: 0, oWins: 0, ties: 0 };
  });

  // 2. Synchronization Effects
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tictactoe_theme', theme);
  }, [theme]);

  useEffect(() => {
    SoundManager.toggle(soundEnabled);
    localStorage.setItem('tictactoe_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Adjust board state when sizing changes
  useEffect(() => {
    resetGame(boardSize);
  }, [boardSize]);

  // 3. Move Handling Logic
  const handleMove = (idx) => {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[stepNumber];
    const squares = [...current.squares];

    // Ignore clicks if space filled or game over
    if (squares[idx] || checkWinner(squares, boardSize)) {
      return;
    }

    const currentPlayer = xIsNext ? 'X' : 'O';
    squares[idx] = currentPlayer;

    // Play placement chime
    SoundManager.playMoveSound(xIsNext);

    const nextHistory = currentHistory.concat([{ squares, lastMove: idx }]);
    setHistory(nextHistory);
    setStepNumber(nextHistory.length - 1);

    // Calculate outcomes
    const gameResult = checkWinner(squares, boardSize);
    if (gameResult) {
      if (gameResult.winner === 'Tie') {
        SoundManager.playDrawSound();
        const nextStats = { ...stats, ties: stats.ties + 1 };
        setStats(nextStats);
        localStorage.setItem('tictactoe_stats', JSON.stringify(nextStats));
      } else {
        SoundManager.playWinSound();
        // Particle fireworks
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: gameResult.winner === 'X' ? ['#00f2fe', '#ffffff'] : ['#f857a6', '#ffffff']
        });
        const nextStats = {
          ...stats,
          xWins: gameResult.winner === 'X' ? stats.xWins + 1 : stats.xWins,
          oWins: gameResult.winner === 'O' ? stats.oWins + 1 : stats.oWins,
        };
        setStats(nextStats);
        localStorage.setItem('tictactoe_stats', JSON.stringify(nextStats));
      }
    }

    setXIsNext(!xIsNext);
  };

  // 4. Utility Handlers
  const resetGame = (size = boardSize) => {
    SoundManager.playClickSound();
    setHistory([{ squares: Array(size * size).fill(null), lastMove: null }]);
    setStepNumber(0);
    setXIsNext(true);
  };

  const resetStats = () => {
    SoundManager.playClickSound();
    const emptyStats = { xWins: 0, oWins: 0, ties: 0 };
    setStats(emptyStats);
    localStorage.setItem('tictactoe_stats', JSON.stringify(emptyStats));
  };

  const setSymbolPreset = (preset) => {
    SoundManager.playClickSound();
    setCustomSymbols({ X: preset.x, O: preset.o });
  };

  const jumpTo = (step) => {
    SoundManager.playClickSound();
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  // 5. Game Computations
  const current = history[stepNumber];
  const gameOutcome = checkWinner(current.squares, boardSize);
  const isGameOver = !!gameOutcome;
  const isBoardDisabled = isGameOver;

  // Status Bar String
  let statusMessage;
  let turnDotClass = xIsNext ? 'x' : 'o';
  if (gameOutcome) {
    if (gameOutcome.winner === 'Tie') {
      statusMessage = "It's a Draw!";
    } else {
      const winnerName = gameOutcome.winner === 'X' ? customSymbols.X : customSymbols.O;
      statusMessage = `Winner: ${winnerName}!`;
    }
  } else {
    const activePlayer = xIsNext ? customSymbols.X : customSymbols.O;
    statusMessage = `Turn: ${activePlayer}`;
  }

  // Row and Col extraction helper for time travel
  const getMoveCoordinateString = (idx) => {
    if (idx === null) return '';
    const r = Math.floor(idx / boardSize) + 1;
    const c = (idx % boardSize) + 1;
    return `(row ${r}, col ${c})`;
  };

  return (
    <div>
      {/* Top Header */}
      <header className="header">
        <h1>Tic Tac Toe</h1>
        <p>A beautifully synthesized 2-player gaming arena</p>
      </header>

      {/* Main Grid Layout */}
      <main className="game-container">
        {/* Left Column: Settings Panel */}
        <section>
          <GameControls
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            customSymbols={customSymbols}
            setSymbolPreset={setSymbolPreset}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            theme={theme}
            setTheme={setTheme}
            onResetGame={() => resetGame()}
            onResetStats={resetStats}
          />
        </section>

        {/* Center Column: The Active Playing Arena */}
        <section className="board-wrapper glass-panel">
          <div className="status-bar glass-panel" style={{
            borderColor: isGameOver ? (gameOutcome.winner === 'Tie' ? 'var(--text-secondary)' : (gameOutcome.winner === 'X' ? 'var(--color-x)' : 'var(--color-o)')) : 'var(--card-border)'
          }}>
            <div className="turn-indicator">
              {!isGameOver && <span className={`turn-dot ${turnDotClass}`}></span>}
              <span>{statusMessage}</span>
            </div>
            
            {boardSize === 5 && !isGameOver && (
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--btn-bg)', borderRadius: '6px' }}>
                4 in a row to win
              </span>
            )}
          </div>

          <Board
            board={current.squares}
            onCellClick={handleMove}
            winningLine={gameOutcome ? gameOutcome.line : null}
            winner={gameOutcome ? gameOutcome.winner : null}
            disabled={isBoardDisabled}
            customSymbols={customSymbols}
          />

          {/* Winning Overlay Screen */}
          {isGameOver && (
            <div className="win-overlay">
              <div className="win-symbol">
                {gameOutcome.winner === 'Tie' ? '🤝' : (gameOutcome.winner === 'X' ? customSymbols.X : customSymbols.O)}
              </div>
              <h2 className={
                gameOutcome.winner === 'Tie' ? 'winner-tie' : (gameOutcome.winner === 'X' ? 'winner-x' : 'winner-o')
              }>
                {gameOutcome.winner === 'Tie' ? "It's a Tie!" : "Winner Winner!"}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {gameOutcome.winner === 'Tie' 
                  ? "Both players fought valiantly." 
                  : `Player ${gameOutcome.winner === 'X' ? customSymbols.X : customSymbols.O} dominated the grid.`
                }
              </p>
              <button className="btn-control active" onClick={() => resetGame()}>
                Play Again
              </button>
            </div>
          )}
        </section>

        {/* Right Column: Game Stats & History timeline */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Leaderboard stats={stats} customSymbols={customSymbols} />

          {/* Time Travel Timeline */}
          <div className="panel glass-panel">
            <h3 className="panel-title">
              <History size={18} />
              Timeline
            </h3>
            
            <div className="history-list">
              {history.map((step, moveIdx) => {
                const isSelected = moveIdx === stepNumber;
                const playedBy = moveIdx % 2 === 1 ? 'X' : 'O';
                const playedByCustom = playedBy === 'X' ? customSymbols.X : customSymbols.O;
                
                return (
                  <button
                    key={moveIdx}
                    className={`history-item ${isSelected ? 'active' : ''}`}
                    onClick={() => jumpTo(moveIdx)}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? '700' : '400' }}>
                      {moveIdx === 0 
                        ? '🎬 Game Launched' 
                        : `Move #${moveIdx}: ${playedByCustom} ${getMoveCoordinateString(step.lastMove)}`
                      }
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: '0.65rem', background: 'var(--text-primary)', color: 'var(--card-bg)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
