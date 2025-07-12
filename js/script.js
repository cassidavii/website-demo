
document.addEventListener('DOMContentLoaded', () => {
    /* ---------- Spin-button press colour ---------- */
    const spinBtn = document.getElementById('spin-button');
    const spinImg = document.getElementById('spin-img');
  
    spinBtn.addEventListener('mousedown', () => {
      spinImg.src = 'z-assets/down.png';
    });
    spinBtn.addEventListener('touchstart', () => {
      spinImg.src = 'z-assets/down.png';
    });
    const resetBtn = () => (spinImg.src = 'z-assets/spin.png');
    spinBtn.addEventListener('mouseup', resetBtn);
    spinBtn.addEventListener('mouseleave', resetBtn);
    spinBtn.addEventListener('touchend', resetBtn);
  
    /* ---------- Icon data ---------- */
    const ICONS = [
      'blue_butterfly.png',
      'blue_heart.png',
      'flower.png',
      'green_heart.png',
      'moon.png',
      'pink_butterfly.png',
      'pink_heart.png',
      'purple_bunny.png',
      'purple_butterfly.png',
      'star.png'
    ];
  
    /* ---------- Grid preparation ---------- */
    const cells = Array.from(document.querySelectorAll('#reels .cell'));
  
    // fill each cell with a random icon once
    cells.forEach(cell => fillRandom(cell));
  
    function fillRandom(cell) {
      const img = document.createElement('img');
      img.src = `z-assets/${ICONS[Math.floor(Math.random() * ICONS.length)]}`;
      cell.innerHTML = '';
      cell.appendChild(img);
    }
  
    /* ========== GRID HELPERS ========== */
function getRows() {
    const COLS = 5, ROWS = 4;
    const rows = Array.from({ length: ROWS }, () => []);
    cells.forEach((cell, i) => {
      const rowIndex = Math.floor(i / COLS);          // 0-3
      const src = cell.firstChild?.getAttribute('src');
      rows[rowIndex].push(src);
    });
    return rows;           // 4 arrays of 5 items each
  }
  
  function getCols() {
    const COLS = 5, ROWS = 4;
    const cols = Array.from({ length: COLS }, () => []);
    cells.forEach((cell, i) => {
      const colIndex = i % COLS;                      // 0-4
      const src = cell.firstChild?.getAttribute('src');
      cols[colIndex].push(src);
    });
    return cols;           // 5 arrays of 4 items each
  }
  
  function allEqual(arr) {
    return arr.every(src => src && src === arr[0]);
  }
  
  function isWinning() {
    const rows = getRows();
    const cols = getCols();
    return rows.some(allEqual) || cols.some(allEqual);
  }
  

    /* ---------- Button triggers the spin ---------- */
    spinBtn.addEventListener('mouseup', startSpin);
    spinBtn.addEventListener('touchend', startSpin);
  
    function startSpin() {
      spinImg.src = 'z-assets/spin.png';
      spinBtn.disabled = true;
  
      const COLS = 5, ROWS = 4;
      const grid = Array.from({ length: COLS }, (_, c) =>
                   Array.from({ length: ROWS }, (_, r) =>
                     cells[r * COLS + c]));
  
      grid.forEach((col, index) => {
        const delay = index * 120;
        spinColumn(col, 900 + delay, delay);
      });
  
      const settleTime = 900 + COLS * 120;

      /* re-enable button */
      setTimeout(() => { spinBtn.disabled = false; }, settleTime);
      
      /* DEBUG — inspect grid content */
      setTimeout(() => {
        console.clear();
        console.log('ROWS:', getRows());
        console.log('COLS:', getCols());
        console.log('isWinning() →', isWinning());
        if (isWinning()) setTimeout(showWin, 300);
      }, settleTime);
      
  
    }
  
    /* ---------- Column animation ---------- */
    function spinColumn(col, duration, startDelay) {
      setTimeout(() => {
        const frameRate = 60;
        const end = performance.now() + duration;
  
        const loop = () => {
          // shift icons down
          for (let i = col.length - 1; i > 0; i--) {
            col[i].innerHTML = col[i - 1].innerHTML;
          }
          // new random icon enters at top
          col[0].innerHTML =
            `<img src="z-assets/${ICONS[Math.random() * ICONS.length | 0]}">`;
  
          if (performance.now() < end) {
            setTimeout(loop, frameRate);
          }
        };
        loop();
      }, startDelay);
    }
  });
  