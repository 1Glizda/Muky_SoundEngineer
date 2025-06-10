document.addEventListener('mousedown', function(e) {
    // Don't trigger on photo sidebar when scrolling
    if (e.target.closest('.photo-sidebar')) {
        return;
    }

    // Ignore double clicks
    if (e.detail === 2) return;

    const clickStartTime = Date.now();
    const clickPosition = { x: e.clientX, y: e.clientY };
    let clickCancelled = false;

    // Cancel if mouse is held down too long (more than 200ms)
    const cancelTimer = setTimeout(() => {
        clickCancelled = true;
    }, 200);

    function handleMouseUp(upEvent) {
        clearTimeout(cancelTimer);
        document.removeEventListener('mouseup', handleMouseUp);

        // Check if it was a valid click (not held too long and didn't move too far)
        const clickDuration = Date.now() - clickStartTime;
        const distanceMoved = Math.sqrt(
            Math.pow(upEvent.clientX - clickPosition.x, 2) + 
            Math.pow(upEvent.clientY - clickPosition.y, 2)
        );

        if (!clickCancelled && clickDuration < 200 && distanceMoved < 10) {
            createAnimation(clickPosition.x, clickPosition.y);
        }
    }

    document.addEventListener('mouseup', handleMouseUp);
});

function createAnimation(x, y) {
    // Create animation container
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    // Create 8 lines at 45 degree intervals with staggered delays
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    
    angles.forEach(angle => {
          const line = document.createElement('div');
          line.className = 'effect-line';
          line.style.setProperty('--angle', `${angle}deg`);
          line.style.setProperty('--angle-rad', `${angle * (Math.PI/180)}rad`);
          effect.appendChild(line);
      });
    
    // Add to DOM
    document.querySelector('.click-effects').appendChild(effect);
    
    // Fade out after animation completes
    setTimeout(() => {
        effect.classList.add('fade-out');
        setTimeout(() => effect.remove(), 300);
    }, 600);
}

document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const h2 = targetSection.querySelector('h2');
        const linkRect = this.getBoundingClientRect();
        const h2Rect = h2.getBoundingClientRect();
        
        const targetScrollPosition = h2Rect.top + (window.scrollY - linkRect.top + 10);
        
        window.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        });
      }
    });
  });