const SIZE = 15;
let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

let currentPlayer;
if (Math.random() < 0.5) {
  currentPlayer = "black";
} else {
  currentPlayer = "white";
}

let lastWinner = null;

const boardDiv = document.getElementById("board");
const turnIndicator = document.getElementById("turnIndicator");
let player1Name = "Player 1"; // black
let player2Name = "Player 2"; // red

document.getElementById("startButton").addEventListener("click", () => {
  player1Name = document.getElementById("player1Input").value || "Player 1";
  player2Name = document.getElementById("player2Input").value || "Player 2";
  updateTurnIndicator();
  renderBoard();
});

// Render the board and stones
function renderBoard() {
  boardDiv.innerHTML = "";
  const cellSize = boardDiv.offsetWidth / (SIZE - 1);

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const x = col * cellSize;
      const y = row * cellSize;

      
      const dot = document.createElement("div");
      dot.className = "intersection";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.dataset.row = row;
      dot.dataset.col = col;
      dot.addEventListener("click", handleMove);
      boardDiv.appendChild(dot);

      if (board[row][col]) {
        const stone = document.createElement("div");
        stone.className = `stone ${board[row][col]}`;
        stone.style.left = `${x}px`;
        stone.style.top = `${y}px`;
        boardDiv.appendChild(stone);
      }
    }
  }
}


// Handle a human move
function handleMove(e) {
  const row = +e.currentTarget.dataset.row;
  const col = +e.currentTarget.dataset.col;

  if (board[row][col]) return;

  board[row][col] = currentPlayer;
  renderBoard();

  if (checkWin(board, currentPlayer)) {
    const winnerName = currentPlayer === "black" ? player1Name : player2Name;
    const playAgain = confirm(`${winnerName} wins! Do you want to play again?`);
    lastWinner = currentPlayer;
    
    if (playAgain) {
      document.getElementById("reset").click();
    } else {
      disableBoard();
    }
    return;
  }

  currentPlayer = currentPlayer === "black" ? "white" : "black";
  updateTurnIndicator();

  // AI plays if it's white's turn
  if (currentPlayer === "white") {
    setTimeout(() => {
      const move = getBestMove(board, 2);
      if (move) {
        board[move.row][move.col] = "white";
        renderBoard();

        if (checkWin(board, "white")) {
          setTimeout(() => {
            const winnerName = player2Name;
            const playAgain = confirm(`${winnerName} wins! Do you want to play again?`);
            lastWinner = "white";
        
            if (playAgain) {
              document.getElementById("reset").click();
            } else {
              disableBoard();
            }
          }, 0);
        }

        currentPlayer = "black";
        updateTurnIndicator();
      }
    }, 100);
  }
}

// Disable further moves
function disableBoard() {
  boardDiv.querySelectorAll(".intersection").forEach(cell => {
    cell.removeEventListener("click", handleMove);
  });
}

// Update turn indicator
function updateTurnIndicator() {
  const name = currentPlayer === "black" ? player1Name : player2Name;
  turnIndicator.textContent = `Current turn: ${name}`;
  if (currentPlayer === "black") {
    turnIndicator.classList.add("player1");
    turnIndicator.classList.remove("player2");
  } else {
    turnIndicator.classList.add("player2");
    turnIndicator.classList.remove("player1");
  }
}

// Reset game and let loser go first
function resetGame() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

  if (lastWinner === "black") {
    currentPlayer = "white";
  } else if (lastWinner === "white") {
    currentPlayer = "black";
  } else {
    currentPlayer = "black"; // Default first game
  }

  renderBoard();

  // AI moves first if it's white's turn
  if (currentPlayer === "white") {
    setTimeout(() => {
      const move = getBestMove(board, 2);
      if (move) {
        board[move.row][move.col] = "white";
        renderBoard();

        if (checkWin(board, "white")) {
          setTimeout(() => {
            const playAgain = confirm(`White wins! Do you want to play again?`);
            lastWinner = "white";
            if (playAgain) {
              resetGame(); //
            } else {
              disableBoard();
            }
          }, 0);
        }

        currentPlayer = "black";
      }
    }, 0);
  }
}

renderBoard();

// If AI starts as white on first load, let it move
if (currentPlayer === "white") {
  setTimeout(() => {
    const move = getBestMove(board, 2);
    if (move) {
      board[move.row][move.col] = "white";
      renderBoard();

      if (checkWin(board, "white")) {
        alert("White wins!");
        lastWinner = "white";
        disableBoard();
      }

      currentPlayer = "black";
    }
  }, 100);
}

document.getElementById("reset").addEventListener("click", resetGame);
resetGame();
