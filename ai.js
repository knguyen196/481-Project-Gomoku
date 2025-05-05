// Defines heuristic pattern scores
const PATTERN_SCORES = {
    'XXXXX': 100000,     // Win
    '_XXXX': 10000,
    'XXXX_': 5000,
    '_XXXX': 5000,
    'XXX_X': 3000,
    'XX_XX': 3000,
    '_XXX_': 1000,
    '_XX_': 100,
    'X_X_X': 150,
    '_X_X_': 150
  };
  
  const SCORES = {
    5: 100000,
    4: 10000,
    3: 1000,
    2: 100,
    1: 10
  };
  
  function evaluate(board) {
    const SIZE = board.length;
    let score = 0;
  
    // Calculate score for a line based on patterns
    function lineScore(line, player) {
      let result = 0;
      let opp;
      if (player === "white"){
        opp = "black";
      } else {
        opp = "white";
      }

      let str = "";
      for (let i = 0; i < line.length; i++) {
        if (line[i] === player) str += 'X';
        else if (line[i] === opp) str += 'O';
        else str += '_';
      }
  
      for (let pattern in PATTERN_SCORES) {
        if (str.includes(pattern)) {
          result += PATTERN_SCORES[pattern];
        }
      }
  
      return result;
    }
    
    // Extract all 5 cell lines from the board in all directions
    function extractLines(board) {
      const lines = [];
  
      // Horizontal
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col <= SIZE - 5; col++) {
          const line = [];
          for (let i = 0; i < 5; i++) {
            line.push(board[row][col + i]);
          }
          lines.push(line);
        }
      }
  
      // Vertical
      for (let col = 0; col < SIZE; col++) {
        for (let row = 0; row <= SIZE - 5; row++) {
          const line = [];
          for (let i = 0; i < 5; i++) {
            line.push(board[row + i][col]);
          }
          lines.push(line);
        }
      }
  
      // Diagonal top-left to bottom-right
      for (let row = 0; row <= SIZE - 5; row++) {
        for (let col = 0; col <= SIZE - 5; col++) {
          const line = [];
          for (let i = 0; i < 5; i++) {
            line.push(board[row + i][col + i]);
          }
          lines.push(line);
        }
      }
  
      // Diagonal bottom-left to top-right
      for (let row = 4; row < SIZE; row++) {
        for (let col = 0; col <= SIZE - 5; col++) {
          const line = [];
          for (let i = 0; i < 5; i++) {
            line.push(board[row - i][col + i]);
          }
          lines.push(line);
        }
      }
  
      return lines;
    }
    
    // Count the number of stones in a line in a specific direction
    function countLine(row, col, dx, dy, player) {
      let count = 0;
  
      for (let i = 0; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
  
        if (
          newRow < 0 || newRow >= SIZE ||
          newCol < 0 || newCol >= SIZE
        ) break;
  
        if (board[newRow][newCol] !== player){
            return 0;
        }
  
        count++;
      }
  
      return count;
    }
  
    // Evaluate score based on the directional patterns
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        for (let p = 0; p < 2; p++) {
          let player;
          if (p === 0) {
            player = "white";
          } else {
            player = "black";
          }

          let sign;
          if (player === "white") {
            sign = 1;
          } else {
            sign = -1;
          }
  
          const directions = [
            [0, 1], // Horizontal
            [1, 0], // Vertical
            [1, 1], // Diagonal down-right
            [1, -1] // Diagonal down-left
          ];
  
          for (let d = 0; d < directions.length; d++) {
            const [dx, dy] = directions[d];
            const count = countLine(row, col, dx, dy, player);
            if (SCORES[count]) {
              score += sign * SCORES[count];
            }
          }
        }
      }
    }
  
    
    const lines = extractLines(board);
    for (let i = 0; i < lines.length; i++) {
      score += lineScore(lines[i], 'white');
      score -= lineScore(lines[i], 'black');
    }
  
    return score;
  }

  
  // Get list of empty cells around the stones
  function getValidMoves(board) {
    const SIZE = board.length;
    const moves = [];
  
    for (let row = 0; row < SIZE; row++) {
      for (let col= 0; col < SIZE; col++) {
        if (board[row][col] !== null) {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const newRow = row + dx;
              const newCol = col + dy;
              if (
                newRow >= 0 && newRow < SIZE &&
                newCol >= 0 && newCol < SIZE &&
                board[newRow][newCol] === null &&
                !moves.some(m => m.row === newRow && m.col === newCol)
              ) {
                moves.push({ row: newRow, col: newCol });
              }
            }
          }
        }
      }
    }
  
    return moves;
  }
  
// Minimax algorithm
  function minimax(board, depth, isMaximizing) {
    if (depth === 0 || checkWin(board, "black") || checkWin(board, "white")) {
      return evaluate(board);
    }
  
    const moves = getValidMoves(board);
    let best;
    if (isMaximizing) {
      best = -Infinity;
    } else {
      best = Infinity;
    }
  
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (isMaximizing) {
        board[move.row][move.col] = "white";
      } else {
        board[move.row][move.col] = "black";
      }

      const score = minimax(board, depth - 1, !isMaximizing);
        board[move.row][move.col] = null;
  
      if (isMaximizing) {
        if (score > best) {
        best = score;
        }
      } else {
        if (score < best){
            best = score;
        }
      }
    }
  
    return best;
  }
  
// Get the best move for the AI
  function getBestMove(board, depth) {
    const moves = getValidMoves(board);
    let bestScore = -Infinity;
    let bestMove = null;
  
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      board[move.row][move.col] = "white";
      const score = minimax(board, depth - 1, false);
      board[move.row][move.col] = null;
  
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  
    return bestMove;
  }
  