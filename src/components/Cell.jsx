// Cell.jsx - Interactive slot on the board grid
import React from 'react';

const Cell = ({ value, onClick, isWinningCell, winningPlayer, disabled, customSymbols }) => {
  // Map internal value ('X' or 'O') to customized visual skin
  const renderSymbol = () => {
    if (!value) return null;
    const symbolSkin = customSymbols[value] || value;
    const className = value === 'X' ? 'symbol-x' : 'symbol-o';
    return <span className={className}>{symbolSkin}</span>;
  };

  const getCellClasses = () => {
    let classes = 'cell';
    if (isWinningCell) {
      classes += ` win win-${winningPlayer.toLowerCase()}`;
    }
    return classes;
  };

  return (
    <button
      className={getCellClasses()}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell played with ${value}` : 'Empty Cell'}
    >
      {renderSymbol()}
    </button>
  );
};

export default Cell;
