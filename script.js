const board = document.querySelector('.board');
let currentPlayer = 'black';

const size = 15;
const gap = 40;

for (let row = 0; row < size; row++) {
  for (let col = 0; col < size; col++) {
    const intersection = document.createElement('div');
    intersection.className = 'intersection';
    intersection.style.left = `${col * gap}px`;
    intersection.style.top = `${row * gap}px`;
    board.appendChild(intersection);

    intersection.addEventListener('click', () => {
      if (intersection.querySelector('.stone')) return;

      const stone = document.createElement('div');
      stone.classList.add('stone', currentPlayer);
      stone.style.left = `${col * gap}px`;
      stone.style.top = `${row * gap}px`;
      board.appendChild(stone);

      currentPlayer = (currentPlayer === 'black') ? 'white' : 'black';
    });
  }
}
