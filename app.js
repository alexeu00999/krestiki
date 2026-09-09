const cells = [...document.querySelectorAll('[data-cell-index]')];
const gameStatus = document.querySelector('#game-status');
const statusKicker = document.querySelector('#status-kicker');
const statusHint = document.querySelector('#status-hint');
const roundNumber = document.querySelector('#round-number');
const scoreX = document.querySelector('#score-x');
const scoreO = document.querySelector('#score-o');
const scoreCardX = document.querySelector('#score-card-x');
const scoreCardO = document.querySelector('#score-card-o');
const newRoundButton = document.querySelector('#new-round');
const resetScoreButton = document.querySelector('#reset-score');

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const state = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  round: 1,
  winningLine: [],
  scores: { X: 0, O: 0 },
  result: null,
};

function evaluateBoard(board) {
  for (const line of winningLines) {
    const [first, second, third] = line;

    if (board[first] && board[first] === board[second] && board[first] === board[third]) {
      return { winner: board[first], line, draw: false };
    }
  }

  return {
    winner: null,
    line: [],
    draw: board.every(Boolean),
  };
}

function startRound(advanceRound = false) {
  if (advanceRound) {
    state.round += 1;
  }

  state.board = Array(9).fill(null);
  state.currentPlayer = 'X';
  state.gameOver = false;
  state.winningLine = [];
  state.result = null;
  render();
}

function handleCellClick(index) {
  if (state.gameOver || state.board[index]) {
    return;
  }

  state.board[index] = state.currentPlayer;
  const result = evaluateBoard(state.board);

  if (result.winner) {
    state.gameOver = true;
    state.result = 'won';
    state.winningLine = result.line;
    state.scores[result.winner] += 1;
  } else if (result.draw) {
    state.gameOver = true;
    state.result = 'draw';
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  }

  render();
}

function resetScore() {
  state.scores = { X: 0, O: 0 };
  render();
}

function render() {
  cells.forEach((cell, index) => {
    const value = state.board[index];
    const isWinning = state.winningLine.includes(index);
    const cellLabel = value ? `Клетка ${index + 1}, ${value}` : `Клетка ${index + 1}, свободна`;

    cell.textContent = value || '';
    cell.disabled = state.gameOver || Boolean(value);
    cell.classList.toggle('is-x', value === 'X');
    cell.classList.toggle('is-o', value === 'O');
    cell.classList.toggle('is-filled', Boolean(value));
    cell.classList.toggle('is-winning', isWinning);
    cell.classList.toggle('is-disabled', state.gameOver && !isWinning);
    cell.setAttribute('aria-label', cellLabel);
    cell.setAttribute('aria-disabled', String(cell.disabled));
  });

  roundNumber.textContent = String(state.round).padStart(2, '0');
  scoreX.textContent = state.scores.X;
  scoreO.textContent = state.scores.O;
  scoreCardX.classList.toggle('is-current', !state.gameOver && state.currentPlayer === 'X');
  scoreCardO.classList.toggle('is-current', !state.gameOver && state.currentPlayer === 'O');

  if (state.result === 'won') {
    const winner = state.board[state.winningLine[0]];
    statusKicker.textContent = 'ПОБЕДА';
    gameStatus.textContent = `Игрок ${winner} забирает партию`;
    statusHint.textContent = 'Линия собрана — сыграем ещё?';
  } else if (state.result === 'draw') {
    statusKicker.textContent = 'ПАТОВАЯ СИТУАЦИЯ';
    gameStatus.textContent = 'Ничья';
    statusHint.textContent = 'На поле больше нет свободных клеток';
  } else {
    statusKicker.textContent = 'СЕЙЧАС ХОДИТ';
    gameStatus.textContent = `Игрок ${state.currentPlayer}`;
    statusHint.textContent = 'Выберите клетку на поле';
  }
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    handleCellClick(Number(cell.dataset.cellIndex));
  });
});

newRoundButton.addEventListener('click', () => startRound(true));
resetScoreButton.addEventListener('click', resetScore);

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'r') {
    startRound(true);
  }
});

render();
