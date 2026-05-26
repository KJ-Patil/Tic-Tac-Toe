// Leaderboard.jsx - Displays running statistics of wins, losses, and ties
import React from 'react';
import { Trophy, Percent } from 'lucide-react';

const Leaderboard = ({ stats, customSymbols }) => {
  const totalGames = stats.xWins + stats.oWins + stats.ties;

  const calculatePercentage = (value) => {
    if (totalGames === 0) return 0;
    return Math.round((value / totalGames) * 100);
  };

  const xPercentage = calculatePercentage(stats.xWins);
  const oPercentage = calculatePercentage(stats.oWins);
  const tiePercentage = calculatePercentage(stats.ties);

  return (
    <div className="panel glass-panel">
      <h3 className="panel-title">
        <Trophy size={18} style={{ color: 'var(--accent-gold)' }} />
        Statistics
      </h3>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-val x">{stats.xWins}</div>
          <div className="stat-label">Wins ({customSymbols.X})</div>
        </div>

        <div className="stat-box">
          <div className="stat-val o">{stats.oWins}</div>
          <div className="stat-label">Wins ({customSymbols.O})</div>
        </div>

        <div className="stat-box" style={{ gridColumn: 'span 2' }}>
          <div className="stat-val" style={{ color: 'var(--text-secondary)' }}>{stats.ties}</div>
          <div className="stat-label">Ties / Cat Games</div>
        </div>
      </div>

      {totalGames > 0 && (
        <div className="setting-group" style={{ marginTop: '0.5rem', animation: 'scale-up 0.3s forwards' }}>
          <label className="setting-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Win Ratio / Distribution</span>
            <span>{totalGames} {totalGames === 1 ? 'game' : 'games'}</span>
          </label>
          
          {/* Progress bar visual distribution */}
          <div style={{
            display: 'flex',
            height: '10px',
            borderRadius: '5px',
            overflow: 'hidden',
            background: 'var(--grid-line)',
            marginTop: '0.25rem'
          }}>
            <div style={{ width: `${xPercentage}%`, background: 'var(--color-x)', transition: 'width 0.4s ease' }} title={`Player X: ${xPercentage}%`} />
            <div style={{ width: `${tiePercentage}%`, background: 'var(--text-secondary)', transition: 'width 0.4s ease' }} title={`Ties: ${tiePercentage}%`} />
            <div style={{ width: `${oPercentage}%`, background: 'var(--color-o)', transition: 'width 0.4s ease' }} title={`Player O: ${oPercentage}%`} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            <span style={{ color: 'var(--color-x)' }}>{customSymbols.X}: {xPercentage}%</span>
            <span>Ties: {tiePercentage}%</span>
            <span style={{ color: 'var(--color-o)' }}>{customSymbols.O}: {oPercentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
