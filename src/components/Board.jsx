// Board.jsx - Grid layout of cells
import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, winningLine, winner, disabled, customSymbols }) => {
  const size = board.length === 9 ? 3 : 5;
  const gridClassName = size === 3 ? 'board-grid-3x3' : 'board-grid-5x5';

  return (
    <div className={gridClassName}>
      {board.map((cellValue, idx) => {
        const isWinningCell = winningLine ? winningLine.includes(idx) : false;
        return (
          <Cell
            key={idx}
            value={cellValue}
            onClick={() => onCellClick(idx)}
            isWinningCell={isWinningCell}
            winningPlayer={winner}
            disabled={disabled}
            customSymbols={customSymbols}
          />
        );
      })}
    </div>
  );
};

export default Board;
