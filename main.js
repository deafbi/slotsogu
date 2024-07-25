// main.js

// Immediately Invoked Function Expression (IIFE) to keep everything private
(function() {
    const iconMap = ["white", "red", "purple", "yellow", "blue", "gold"],
          icon_width = 121,
          icon_height = 120,
          num_icons = 6,
          time_per_icon = 100,
          indexes = [0, 0, 0];
    
    let isRolling = false;
    let winningAmount = 0;
    let balance = 500;

    // Get the balance element
    const obj = document.getElementById("value");
    obj.innerText = "500";
    
    // Private function to roll one reel
    const roll = (reel, offset = 0) => {
        return new Promise((resolve) => {
            const style = getComputedStyle(reel),
                  currentPosition = parseFloat(style["background-position-y"]) || 0,
                  delta = (offset + 5) * num_icons + Math.floor(Math.random() * num_icons),
                  targetPosition = currentPosition + delta * icon_height,
                  normTargetPosition = targetPosition % (num_icons * icon_height),
                  middleIndex = (Math.floor((normTargetPosition + icon_height / 2) / icon_height) % num_icons) + 1;
            
            setTimeout(() => {
                reel.style.transition = `background-position-y ${time_per_icon * delta}ms cubic-bezier(.41,-0.01,.63,1.09)`;
                reel.style.backgroundPositionY = `-${targetPosition}px`;
            }, offset * 150);
            
            setTimeout(() => {
                reel.style.transition = 'none';
                reel.style.backgroundPositionY = `-${normTargetPosition}px`;
                resolve(middleIndex);
            }, time_per_icon * delta + offset * 150);
        });
    };
    
    // Private function to add flashing border
    function addFlashingBorder() {
        const elements = document.querySelectorAll('.slots .flex-row .slot-right .row .center');
        elements.forEach(element => {
            element.classList.add('flashing-border');
        });
    }
    
    // Private function to remove flashing border
    function removeFlashingBorder() {
        const elements = document.querySelectorAll('.slots .flex-row .slot-right .row .center');
        elements.forEach(element => {
            element.classList.remove('flashing-border');
        });
    }
    
    // Private function to animate value
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          obj.innerHTML = Math.floor(progress * (end - start) + start);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
    }
    
    // Private function to roll all reels
    function rollAll() {
        if (isRolling || balance <= 0) return;
        
        isRolling = true;
        winningAmount = 0;
        balance -= 10;
        animateValue(obj, balance + 10, balance, 100);
        
        const reelsList = document.querySelectorAll('.slots > .flex-row > .slot-right > .row > .reel');
        
        Promise.all([...reelsList].map((reel, i) => roll(reel, i)))
            .then((deltas) => {
                deltas.forEach((delta, i) => indexes[i] = delta);
                
                if (indexes[0] == 6 && indexes[1] == 6 && indexes[2] == 6) {
                    addFlashingBorder();
                    winningAmount = 120;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else if (indexes[0] == 3 && indexes[1] == 3 && indexes[2] == 3) {
                    addFlashingBorder();
                    winningAmount = 150;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else if (indexes[0] == 4 && indexes[1] == 4 && indexes[2] == 4) {
                    addFlashingBorder();
                    winningAmount = 180;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else if (indexes[0] == 2 && indexes[1] == 2 && indexes[2] == 2) {
                    addFlashingBorder();
                    winningAmount = 225;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else if (indexes[0] == 1 && indexes[1] == 1 && indexes[2] == 1) {
                    addFlashingBorder();
                    winningAmount = 375;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else if (indexes[0] == 5 && indexes[1] == 5 && indexes[2] == 5) {
                    addFlashingBorder();
                    winningAmount = 750;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else if (
                    (indexes[0] === 5 || indexes[0] === 2) &&
                    (indexes[1] === 1 || indexes[1] === 3) &&
                    (indexes[2] === 4 || indexes[2] === 6)
                ) {
                    addFlashingBorder();
                    winningAmount = 60;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else if (
                    (indexes[0] === 4 || indexes[0] === 2 || indexes[0] === 6) &&
                    (indexes[1] === 4 || indexes[1] === 2 || indexes[1] === 6) &&
                    (indexes[2] === 4 || indexes[2] === 2 || indexes[2] === 6)
                ) {
                    addFlashingBorder();
                    winningAmount = 15;
                    animateValue(obj, balance, balance + winningAmount, 1950);
                } else {
                    winningAmount = 0;
                    removeFlashingBorder();
                }
                
                balance += winningAmount;
                setTimeout(() => {
                    removeFlashingBorder();
                }, 3900);
                console.log("Winnings: " + winningAmount);
                isRolling = false;
            });
    }
    
    // Initialize the spin button state on page load
    document.addEventListener('DOMContentLoaded', () => {
        // Add event listener for the spin button
        const spinButton = document.getElementById('spinButton');
        spinButton.addEventListener('click', rollAll);
    });
})();
