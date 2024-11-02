let recognitionActive = false; // Track if recognition is active
let recognitionTimeout; // Track timeout for stopping recognition
let recognition; // Store the recognition object globally
let scrollHeight = 150; // Default scroll height (can be updated by the user)

function setUpSpeechRecognition() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error("Speech Recognition API is not supported in this browser.");
        alert("Speech Recognition API is not supported in this browser.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = function (event) {
        var last = event.results.length - 1;
        var command = event.results[last][0].transcript.trim().toLowerCase();
        console.log('Command:', command);

        // Scroll based on voice command and user-defined scroll height
        if (command === 'up') {
            window.scrollBy(0, -scrollHeight); // Scroll up
            console.log(`Scrolled up by ${scrollHeight}px`);
        } else if (command === 'down') {
            window.scrollBy(0, scrollHeight); // Scroll down
            console.log(`Scrolled down by ${scrollHeight}px`);
        } else {
            console.log('Unrecognized command:', command);
        }
    };

    recognition.onspeechend = function () {
        recognition.start(); // Restart recognition after each speech ends
    };

    recognition.onerror = function (event) {
        console.log('Error in recognition:', event.error);
        if (event.error === 'no-speech') {
            recognition.start(); // Restart on 'no-speech' error
        }
    };

    recognitionActive = true;
    recognition.start();
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
        recognitionActive = false;
        clearTimeout(recognitionTimeout);
        console.log('Speech recognition stopped.');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startListening') {
        if (recognitionActive) {
            sendResponse({ status: 'Speech recognition is already active.' });
        } else {
            scrollHeight = request.scrollHeight || 150; // Use user-defined scroll height or default 150px
            console.log('Starting speech recognition for', request.duration, 'minutes with scroll height:', scrollHeight);
            setUpSpeechRecognition();

            // Stop after the specified time in minutes
            recognitionTimeout = setTimeout(() => {
                stopSpeechRecognition();
            }, request.duration * 60 * 1000); // Convert minutes to milliseconds

            sendResponse({ status: 'Speech recognition started for ' + request.duration + ' minutes with scroll height: ' + scrollHeight + 'px.' });
        }
    }

    if (request.action === 'stopListening') {
        if (recognitionActive) {
            stopSpeechRecognition();
            sendResponse({ status: 'Speech recognition stopped.' });
        } else {
            sendResponse({ status: 'Speech recognition is not active.' });
        }
    }

    return true;
});
