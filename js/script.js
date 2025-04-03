let closedPopupsCount = 0; // Track number of closed popups
let glitchPlayed = false;  // Ensure glitch effect only plays once every 5 popups closed
let popupCount = 0;  // Track the total number of popups opened
let audio = new Audio('glitchy-star-sounds.mp3'); // Windows loading sound
audio.loop = true;  // Set the sound to loop

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        openPopup('error1', 'Welcome back to Windows00', ':) ');
    }, 500);
});

function openPopup(id, title, message, imgSrc) {
    let popup = document.createElement("div");
    popup.classList.add("popup");
    popup.id = id;

    let sizes = {
        "error1": { width: 300, height: 200 },
        "error2": { width: 350, height: 250 },
        "error3": { width: 400, height: 350 },
        "error4": { width: 550, height: 550 },
        "error5": { width: 400, height: 320 },
        "error6": { width: 420, height: 450 },
        "error7": { width: 580, height: 450 },
        "error8": { width: 520, height: 400 }
    };

    let size = sizes[id] || { width: 300, height: 200 };
    popup.style.width = `${size.width}px`;
    popup.style.height = `${size.height}px`;
    popup.style.position = "absolute";
    popup.style.top = Math.random() * 50 + "%";
    popup.style.left = Math.random() * 50 + "%";
    popup.style.zIndex = "1000";

    popup.onmousedown = bringToFront;

    let header = document.createElement("div");
    header.classList.add("popup-header");
    header.innerHTML = `${title} <span onclick="closePopup('${id}')">X</span>`;

    let content = document.createElement("div");
    content.classList.add("popup-content");

    let textElement = document.createElement("p");
    textElement.innerText = message;
    content.appendChild(textElement);

    if (imgSrc) {
        let imgElement = document.createElement("img");
        imgElement.src = imgSrc;
        imgElement.alt = "Error Image";
        imgElement.style.maxWidth = "100%";
        imgElement.style.maxHeight = `${size.height * 0.9}px`;
        imgElement.style.display = "block";
        imgElement.style.margin = "10px auto";
        content.appendChild(imgElement);

        if (id === "error3") {
            imgElement.onclick = function() {
                audio.play();  // Start the audio when the image is clicked
            };
        }
    }

    // Add "Click here to claim" button to trigger smiley effect for error5
    if (id === 'error5') {
        let closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.innerText = "Click here to claim";
        closeButton.onclick = function() {
            triggerRandomSmileyEffect(); // Trigger the random smiley effect when the button is clicked
        };
        content.appendChild(closeButton); // Add button to the content section
    }

    // Function to trigger the smiley effect
    function triggerRandomSmileyEffect() {
        let smileyCount = 10000; // Number of smiley images to show randomly
        let smileyWidth = 100; // Width of each smiley image (adjust as necessary)
        let smileyHeight = 100; // Height of each smiley image (adjust as necessary)
        let delay = .5; // Delay between each smiley appearing (in milliseconds)

        for (let i = 0; i < smileyCount; i++) {
            setTimeout(function() {
                let smiley = document.createElement("img");
                smiley.src = "images/smiley.png"; // Path to your smiley image
                smiley.classList.add("random-smiley");

                // Random position on the screen
                let randomX = Math.random() * (window.innerWidth - smileyWidth);
                let randomY = Math.random() * (window.innerHeight - smileyHeight);

                smiley.style.left = `${randomX}px`;
                smiley.style.top = `${randomY}px`;
                smiley.style.zIndex = 9999; // Make sure smileys are on top of everything

                document.body.appendChild(smiley); // Add the smiley to the body
            }, i * delay); // Delay each smiley by 50ms
        }

        // Set a timeout to reset the page once the screen is full of smileys
        setTimeout(function() {
            location.reload(); // This reloads the page, effectively "resetting" the site
        }, smileyCount * delay + 0); // Give extra time after last smiley to finish, then reset the page
    }

    popup.appendChild(header);
    popup.appendChild(content);
    document.body.appendChild(popup);

    // Only trigger glitch effect after 5 popups or for error5
    if (id === 'error5') {
        playGlitchEffect();
        playErrorSound();
    }

    makeDraggable(popup);

    // Increment popup count
    popupCount++;

    // If 20 popups are opened, show the blue screen
    if (popupCount >= 30) {
        showBlueScreen();
    }
}

function bringToFront(event) {
    let popups = document.querySelectorAll(".popup");
    popups.forEach(popup => popup.style.zIndex = "1000");
    event.currentTarget.style.zIndex = "1010";
}

function closePopup(id) {
    let popup = document.getElementById(id);
    if (popup) popup.remove();
    closedPopupsCount++;

    // Stop the sound if the popup being closed is error3
    if (id === "error3") {
        audio.pause();
        audio.currentTime = 0; // Reset the sound position
    }

    // Every 5 popups closed, play sound and glitch effect, if not already played
    if (closedPopupsCount % 5 === 0 && !glitchPlayed) {
        playErrorSound();
        playGlitchEffect();
        glitchPlayed = true;  // Prevent multiple glitch effects from being played continuously
    }

    triggerChat(id);
    setTimeout(maybeOpenOneOrTwoPopups, 1000);

    if (id === "error1") {
        setTimeout(openGuaranteedPopup, 1000);
    } else {
        setTimeout(maybeOpenOneOrTwoPopups, 500);
    }
}

// New function to guarantee exactly one or two popups
function maybeOpenOneOrTwoPopups() {
    let popups = [
        { id: 'error3', title: ' ', message: ' ', img: 'images/fortune.gif' },
        { id: 'error4', title: 'ignore this! it is NOT real.', message: ' ', img: 'images/scary-woods.png' },
        { id: 'error5', title: 'Congratulations', message: ' ', img: 'images/smiley-phone-ad.png' },
        { id: 'error6', title: 'hello!', message: ' ', img: 'images/scary-man.gif' },
        { id: 'error7', title: ' ', message: ' ', img: 'images/date-ai.png' }
    ];

    let numPopupsToOpen = Math.floor(Math.random() * 2) + 1;  // Randomly choose 1 or 2 popups

    // Open exactly one or two popups
    for (let i = 0; i < numPopupsToOpen; i++) {
        let selectedPopup = popups[Math.floor(Math.random() * popups.length)];
        openPopup(selectedPopup.id, selectedPopup.title, selectedPopup.message, selectedPopup.img);
    }
}

function triggerChat(id) {
    let chatMessages = {
        "error1": "I'm so happy you're here!", 
        "error2": "You shouldn’t have done that...", 
        "error3": "You're missing out!",
        "error4": "Yeah, don't look at that.",
        "error5": "Why would you ignore that?",
        "error6": "DON'T IGNORE ME!!!",
        "error7": "Do you not love me anymore?"
    };
    if (chatMessages[id]) createChatBubble(chatMessages[id]);
}

function createChatBubble(message) {
    let bubble = document.createElement("div");
    bubble.classList.add("chat-bubble");
    bubble.innerText = message;
    document.body.appendChild(bubble);
    setTimeout(() => { bubble.remove(); }, 5000);
}

function playErrorSound() {
    let audio = new Audio('https://www.myinstants.com/media/sounds/windows-xp-error.mp3');
    audio.play();
}

function playGlitchEffect() {
    document.body.style.animation = "glitch 0.2s ease-in-out";
    setTimeout(() => { document.body.style.animation = ""; }, 200);
}

function makeDraggable(popup) {
    let shiftX, shiftY;

    function onMouseMove(event) {
        popup.style.left = event.clientX - shiftX + 'px';
        popup.style.top = event.clientY - shiftY + 'px';
    }

    function onMouseDown(event) {
        shiftX = event.clientX - popup.getBoundingClientRect().left;
        shiftY = event.clientY - popup.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    }

    popup.addEventListener('mousedown', onMouseDown);
}

function showBlueScreen() {
    let blueScreen = document.createElement('div');
    blueScreen.style.position = 'fixed';
    blueScreen.style.top = 0;
    blueScreen.style.left = 0;
    blueScreen.style.width = '100vw';
    blueScreen.style.height = '100vh';
    blueScreen.style.background = 'url("images/bluescreen.png") no-repeat center center';
    blueScreen.style.backgroundSize = 'cover';
    blueScreen.style.zIndex = '10000';
    blueScreen.style.pointerEvents = 'none';  // Block interaction
    document.body.appendChild(blueScreen);

    setTimeout(() => {
        location.reload();
    }, 4000);
}
