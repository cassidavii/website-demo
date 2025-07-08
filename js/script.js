
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
  
      setTimeout(() => (spinBtn.disabled = false), 900 + COLS * 120);
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
  