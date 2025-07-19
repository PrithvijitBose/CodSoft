// Game state variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// DOM references
const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restartBtn");

// Winning conditions (rows, columns, diagonals)
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Render the current board state
function renderBoard() {
  boardElement.innerHTML = "";

  board.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.dataset.index = index;
    cellDiv.innerText = cell;

    // Add animation if filled
    if (cell !== "") {
      cellDiv.classList.add("filled");
    }

    cellDiv.addEventListener("click", handleCellClick);
    boardElement.appendChild(cellDiv);
  });
}

// Handle a user's move
function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    statusText.innerText = `${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O") {
    aiMove();
  }
}

// Check if a player has won
function checkWin(player) {
  for (let condition of winConditions) {
    if (condition.every(index => board[index] === player)) {
      // Highlight winning cells
      condition.forEach(index => {
        document.querySelectorAll(".cell")[index].classList.add("win");
      });
      return true;
    }
  }
  return false;
}

// AI Move using Minimax with Alpha-Beta Pruning
function aiMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = "O";
  currentPlayer = "X";
  renderBoard();

  if (checkWin("O")) {
    statusText.innerText = "O Wins!";
    gameActive = false;
  } else if (!board.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
  }
}

// Minimax Algorithm with Alpha-Beta Pruning
function minimax(boardState, depth, isMaximizing, alpha, beta) {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (!boardState.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false, alpha, beta);
        boardState[i] = "";
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Prune unnecessary branches
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true, alpha, beta);
        boardState[i] = "";
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Prune unnecessary branches
      }
    }
    return bestScore;
  }
}

// Restart game logic
restartButton.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.innerText = "";

  // Remove animation/highlight classes
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("filled", "win");
  });

  renderBoard();
});

// Initial render
renderBoard();
