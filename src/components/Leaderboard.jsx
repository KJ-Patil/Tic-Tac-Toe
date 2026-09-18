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
    <div className="panel glass-panel stats-panel">
      <h3 className="panel-title">
        <Trophy size={16} style={{ color: 'var(--accent-gold)' }} />
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

        <div className="stat-box stat-box-ties">
          <div className="stat-val ties">{stats.ties}</div>
          <div className="stat-label">Ties / Cat Games</div>
        </div>
      </div>

      {totalGames > 0 && (
        <div className="stat-distribution">
          <div className="stat-distribution-header">
            <span>Win Ratio</span>
            <span>{totalGames} {totalGames === 1 ? 'game' : 'games'}</span>
          </div>
          
          {/* Progress bar visual distribution */}
          <div className="stat-progress-bar">
            <div className="liquid-fill liquid-fill-x" style={{ width: `${xPercentage}%` }} title={`Player X: ${xPercentage}%`} />
            <div className="liquid-fill liquid-fill-tie" style={{ width: `${tiePercentage}%` }} title={`Ties: ${tiePercentage}%`} />
            <div className="liquid-fill liquid-fill-o" style={{ width: `${oPercentage}%` }} title={`Player O: ${oPercentage}%`} />
          </div>

          <div className="stat-distribution-footer">
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
