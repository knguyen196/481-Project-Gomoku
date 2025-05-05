const SIZE = 15;
let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
let currentPlayer = "black";
let lastWinner = null;

const boardDiv = document.getElementById("board");

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
    alert(`${currentPlayer} wins!`);
    lastWinner = currentPlayer;
    disableBoard();
    return;
  }

  if (currentPlayer === "black") {
    currentPlayer = "white";
  } else {
    currentPlayer = "black";
  }

  // AI plays if it's white's turn
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
}

// Disable further moves
function disableBoard() {
  boardDiv.querySelectorAll(".cell").forEach(cell => {
    cell.removeEventListener("click", handleMove);
  });
}

// Reset game and let loser go first
document.getElementById("reset").addEventListener("click", () => {
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
          alert("White wins!");
          lastWinner = "white";
          disableBoard();
        }

        currentPlayer = "black";
      }
    }, 100);
  }
});

renderBoard();
