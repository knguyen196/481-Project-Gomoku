# 481-Project-Gomoku

This is an implementation of **Gomoku**, where a human player plays against an AI on a 15x15 board. The AI uses a heuristic evaluation with the **minimax algorithm** to determine the best moves.

---

## Project Structure

index.html - Main HTML page that renders the board and UI

style.css - Styles for the board, stones, and layout

script.js - Handles board rendering, user input, and gameplay flow

ai.js - Minimax algorithm and evaluation logic for the AI

checkwin.js - Function to check if a player has won



---

##  File Descriptions

### `index.html`
- Main HTML entry point.
- Links CSS and JS files

---

### `style.css`
- Styles the Gomoku board, intersections, and stones.
- Stones are placed on **intersections**.

---

### `script.js`
- Manages:
  - The board rendering (`renderBoard`)
  - Player turns and interaction (`handleMove`)
  - Game reset logic (`resetGame`)

---

### `ai.js`
- Implements the **Minimax** algorithm with depth control.
- Includes:
  - `evaluate()`: Heuristic function combining pattern matching and direction scoring
  - `getValidMoves()`: Limits AI consideration to only cells near stones
  - `minimax()` and `getBestMove()`: Core AI decision-making
- Makes the AI consider blocked and open lines.

---

### `checkwin.js`
- Contains `checkWin(board, player)`:
  - Checks all four directions from every cell
  - Detects if there are **5 consecutive stones** of the same player
  - Used by both the human and AI logic to determine if the game is over.
--  
