/**
 * Setup
 */
const iconMap = ["white", "red", "purple", "yellow", "blue", "gold"],
    icon_width = 121,    // Width of each icon (adjust if necessary)
    icon_height = 120,    // Height of each icon
    num_icons = 6,    // Number of icons
    time_per_icon = 100,    // Duration to animate one icon down (in ms)
    indexes = [0, 0, 0];    // Holds icon indexes

let isRolling = false;
let winningAmount = 0;
let balance = 500;


// Audio setup
const spinSound = new Audio('./assets/edit.mp3'); // Replace with the path to your sound file
spinSound.loop = true; // Loop the sound while spinning

const wonSound = new Audio('./assets/won.mp3');
wonSound.loop = true;

const obj = document.getElementById("value");
obj.innerText = "500";

/** 
 * Roll one reel
 */
const roll = (reel, offset = 0) => {
    return new Promise((resolve) => {
        const style = getComputedStyle(reel),
            currentPosition = parseFloat(style["background-position-y"]) || 0,
            // Minimum of 2 full spins + random additional spins
            delta = (offset + 5) * num_icons + Math.floor(Math.random() * num_icons),
            targetPosition = currentPosition + delta * icon_height,
            normTargetPosition = targetPosition % (num_icons * icon_height),
            // Calculate the final index to show the item in the middle
            middleIndex = (Math.floor((normTargetPosition + icon_height / 2) / icon_height) % num_icons) + 1;
        
        // Debugging
        console.log(`Reel ${offset}: currentPosition=${currentPosition}, delta=${delta}, targetPosition=${targetPosition}, normTargetPosition=${normTargetPosition}`);
        
        // Start animation
        setTimeout(() => {
            reel.style.transition = `background-position-y ${time_per_icon * delta}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            reel.style.backgroundPositionY = `-${targetPosition}px`;
        }, offset * 150);
        
        // End animation
        setTimeout(() => {
            reel.style.transition = 'none';
            reel.style.backgroundPositionY = `-${normTargetPosition}px`;
            // Calculate which icon it landed on
            console.log(`Reel ${offset} middleIndex=${middleIndex}`);
            resolve(middleIndex);
        }, time_per_icon * delta + offset * 150);
    });
};

function addFlashingBorder() {
    const elements = document.querySelectorAll('.slots .flex-row .slot-right .row .center');
    elements.forEach(element => {
        // Add the CSS class with the animation
        element.classList.add('flashing-border');
    });
}

function removeFlashingBorder() {
    const elements = document.querySelectorAll('.slots .flex-row .slot-right .row .center');
    elements.forEach(element => {
        // Remove the CSS class with the animation
        element.classList.remove('flashing-border');
    });
}

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

/**
 * Roll all reels
 */
function rollAll() {
    if (isRolling == true || balance <= 0) {
        return;
    } else {
        isRolling = true;
    }

    winningAmount = 0;
    balance -= 5;
    animateValue(obj, balance+5, balance, 100);
    
    console.log('Rolling...');

    // Play spin sound
    if (!isMuted) {
        spinSound.play();
    }

    const reelsList = document.querySelectorAll('.slots > .flex-row > .slot-right > .row > .reel');
    
    Promise
        .all([...reelsList].map((reel, i) => roll(reel, i)))
        .then((deltas) => {
            deltas.forEach((delta, i) => {
                indexes[i] = delta
            });
            spinSound.pause();
            console.log('Results:', indexes.map(i => iconMap[i] || 'white').join(' - '));
        
            // Win conditions
            console.log(indexes);

            if (indexes[0] == 6 && indexes[1] == 6 && indexes[2] == 6) {
                if (!isMuted) {
                    wonSound.play();
                }
                addFlashingBorder();
                winningAmount = 15;
                animateValue(obj, balance, balance+winningAmount, 1950);

                setTimeout(() => {
                    removeFlashingBorder();
                    wonSound.pause();
                    wonSound.currentTime = 0;
                    isRolling = false;
                }, 3900); 
            } else if (indexes[0] == 3 && indexes[1] == 3 && indexes[2] == 3) {
                if (!isMuted) {
                    wonSound.play();
                }
                addFlashingBorder();
                winningAmount = 25;
                animateValue(obj, balance, balance+winningAmount, 1950);
                
                setTimeout(() => {
                    removeFlashingBorder();
                    wonSound.pause();
                    wonSound.currentTime = 0;
                    isRolling = false;
                }, 3900); 
            } else if (indexes[0] == 4 && indexes[1] == 4 && indexes[2] == 4) {
                if (!isMuted) {
                    wonSound.play();
                }
                addFlashingBorder();
                winningAmount = 75;
                animateValue(obj, balance, balance+winningAmount, 1950);
                
                setTimeout(() => {
                    removeFlashingBorder();
                    wonSound.pause();
                    wonSound.currentTime = 0;
                    isRolling = false;
                }, 3900); 
            }  else if (indexes[0] == 2 && indexes[1] == 2 && indexes[2] == 2) {
                if (!isMuted) {
                    wonSound.play();
                }
                addFlashingBorder();
                winningAmount = 100;
                animateValue(obj, balance, balance+winningAmount, 1950);
                
                setTimeout(() => {
                    removeFlashingBorder();
                    wonSound.pause();
                    wonSound.currentTime = 0;
                    isRolling = false;
                }, 3900); 
            }  else if (indexes[0] == 1 && indexes[1] == 1 && indexes[2] == 1) {
                if (!isMuted) {
                    wonSound.play();
                }
                addFlashingBorder();
                winningAmount = 150;
                animateValue(obj, balance, balance+winningAmount, 1950);
                
                setTimeout(() => {
                    removeFlashingBorder();
                    wonSound.pause();
                    wonSound.currentTime = 0;
                    isRolling = false;
                }, 3900); 
            }  else if (indexes[0] == 5 && indexes[1] == 5 && indexes[2] == 5) {
                if (!isMuted) {
                    wonSound.play();
                }
                
                addFlashingBorder();
                winningAmount = 250;
                animateValue(obj, balance, balance+winningAmount, 1950);
                
                setTimeout(() => {
                    removeFlashingBorder();
                    wonSound.pause();
                    wonSound.currentTime = 0;
                    isRolling = false;
                }, 3900); 
            } else if (
                (indexes[0] === 5 || indexes[0] === 2) &&
                (indexes[1] === 1 || indexes[1] === 3) &&
                (indexes[2] === 4 || indexes[2] === 6)
            ) {
                if (!isMuted) {
                    wonSound.play();
                }
                addFlashingBorder();
                winningAmount = 10;
                animateValue(obj, balance, balance+winningAmount, 1950);
                
                setTimeout(() => {
                    removeFlashingBorder();
                    wonSound.pause();
                    wonSound.currentTime = 0;
                    isRolling = false;
                }, 3900); 
            }else {
                winningAmount = 0;
                removeFlashingBorder();
                wonSound.pause();
                wonSound.currentTime = 0;
                isRolling = false;
            }

            // Stop the spin sound
            
            balance += winningAmount;
            spinSound.currentTime = 0;
            wonSound.currentTime = 0;
            console.log("Winnings: " + winningAmount);

            // Schedule the next roll
        });
}

// Initialize mute state from local storage
let isMuted = localStorage.getItem('isMuted') === 'true';

// Function to toggle mute/unmute
function toggleMute() {
    isMuted = !isMuted;

    // Update the icon based on mute state
    const muteIcon = document.getElementById('muteIcon');
    if (isMuted) {
        muteIcon.classList.remove('fa-volume-up');
        muteIcon.classList.add('fa-volume-mute');
    } else {
        muteIcon.classList.remove('fa-volume-mute');
        muteIcon.classList.add('fa-volume-up');
    }

    // Save the mute state to local storage
    localStorage.setItem('isMuted', isMuted);
}

// Initialize the mute button state on page load
document.addEventListener('DOMContentLoaded', () => {
    const muteIcon = document.getElementById('muteIcon');
    if (isMuted) {
        muteIcon.classList.remove('fa-volume-up');
        muteIcon.classList.add('fa-volume-mute');
    } else {
        muteIcon.classList.remove('fa-volume-mute');
        muteIcon.classList.add('fa-volume-up');
    }
});

