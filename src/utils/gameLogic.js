// gameLogic.js - Rules & win condition evaluator for 3x3 and 5x5 Tic Tac Toe

export function getWinningLines(size) {
  const lines = [];
  const winLength = size === 3 ? 3 : 4;

  // Horizontal
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push(r * size + (c + i));
      }
      lines.push(line);
    }
  }

  // Vertical
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((r + i) * size + c);
      }
      lines.push(line);
    }
  }

  // Diagonal down-right
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((r + i) * size + (c + i));
      }
      lines.push(line);
    }
  }

  // Diagonal up-right
  for (let r = winLength - 1; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push((r - i) * size + (c + i));
      }
      lines.push(line);
    }
  }

  return lines;
}

export function checkWinner(board, size) {
  const lines = getWinningLines(size);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstVal = board[line[0]];
    if (firstVal && line.every(index => board[index] === firstVal)) {
      return { winner: firstVal, line };
    }
  }

  if (board.every(cell => cell !== null)) {
    return { winner: 'Tie', line: null };
  }

  return null;
}
