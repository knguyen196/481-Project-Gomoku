//Function to evaluate the board and check for a win
function checkWin(board, player) {
    const SIZE = board.length;

    const directions = [
        [0,1], // Horizontal
        [1,0], // Vertical
        [1,1], // Diagonal down-right
        [1,-1] // Diagonal down-left
    ]

    for (let row = 0; row < SIZE; row++){
        for (let col = 0; col < SIZE; col++){
            if (board[row][col] !== player) continue; // Skip if not the current player's stone

            for (let d = 0; d<directions.length; d++){
                const [dx, dy] = directions[d];
                let count = 1;

                for (let step = 1; step < 5; step++){
                    const newRow = row + dx * step;
                    const newCol = col + dy * step;
                
                if (newRow < 0 || newRow >= SIZE || newCol < 0 || newCol >= SIZE) break; // Out of bounds
                if (board[newRow][newCol] == player) {
                    count++;
                } else {
                    break
                }
            }

            if (count === 5) {
                return true; // Win condition met
            }
        }
    }
}
    return false;

}

function cloneBoard(board) {
    return board.map(row => row.slice());
}