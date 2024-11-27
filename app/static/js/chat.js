const messagesDiv = document.getElementById('messages');

// Function to append messages to the chat with a timestamp
function appendMessage(sender, message, timestamp, immediate = false) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('message');

    // Add specific class based on sender (user or bot)
    if (sender === 'You') {
        messageElem.classList.add('user'); // Add the user class for styling
    } else {
        messageElem.classList.add('bot'); // Add the bot class for styling
    }

    // Dynamically create header text: "Name • Timestamp"
    const name = sender === 'You' ? 'You' : 'Leo'; // Determine the name
    const headerText = `${name} • ${timestamp}`; // Combine name and timestamp

    // Create the header element and set its text content
    const headerElem = document.createElement('div');
    headerElem.classList.add('message-header');
    headerElem.textContent = headerText;

    // Create the message text element
    const messageTextElem = document.createElement('div');
    messageTextElem.classList.add('message-text');
    messageTextElem.textContent = message;

    // Append header and text to the message element
    messageElem.appendChild(headerElem);
    messageElem.appendChild(messageTextElem);

    // Handle immediate vs delayed appending
    if (sender === 'Chatbot' && !immediate) {
        // Delay appending header with message if not immediate
        setTimeout(() => {
            messagesDiv.appendChild(messageElem);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 1500); // 1.5 seconds delay (adjust as needed)
    } else {
        // Append both immediately for the user's message or welcome message
        messagesDiv.appendChild(messageElem);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Function to append a greeting message
function appendGreetingMessage() {
    const now = new Date();

    // Determine the greeting based on the time of day
    const hours = now.getHours();
    let greeting = 'Good Morning!';
    if (hours >= 12 && hours < 18) {
        greeting = 'Good Afternoon!';
    } else if (hours >= 18) {
        greeting = 'Good Evening!';
    }

    // Format the current day and time
    const currentDay = now.toLocaleDateString([], { weekday: 'long' });
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Create a container for the greeting message
    const greetingElem = document.createElement('div');
    greetingElem.classList.add('greeting-message');

    // Add the greeting text
    const greetingTextElem = document.createElement('div');
    greetingTextElem.classList.add('greeting-text');
    greetingTextElem.textContent = greeting;

    // Add the secondary line with the day and timestamp
    const greetingDetailsElem = document.createElement('div');
    greetingDetailsElem.classList.add('greeting-details');
    greetingDetailsElem.textContent = `${currentDay}, ${currentTime}`;

    // Append both parts to the greeting container
    greetingElem.appendChild(greetingTextElem);
    greetingElem.appendChild(greetingDetailsElem);

    // Append the greeting container to the messages container
    messagesDiv.appendChild(greetingElem);
}

// Function to handle the send message button click
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim(); // Trim input to avoid empty or space-only messages

    // Prevent sending empty messages
    if (!message) return;

    // Get the current time for the user's message in 12-hour format
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Append the user's message to the chat
    appendMessage('You', message, userTimestamp);

    // Clear the input field after appending the message
    userInput.value = '';

    // Reset the character count
    resetCharCount();

    // Reset the height of the input area after sending the message
    userInput.style.height = 'auto';

    // Show the typing indicator
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';

    try {
        // Make the API request and get the response
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            alert('Sorry, there was an error processing your message. Please try again.');
            return;
        }

        const data = await response.json();

        // Simulate a delay in response
        setTimeout(() => {
            // Hide the typing indicator
            typingIndicator.style.display = 'none';

            // Append the bot's response after the delay
            const botMessage = data.bot_response.message;
            const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            appendMessage('Chatbot', botMessage, botTimestamp);
        }, 1500); // 1.5 seconds delay (adjust as needed)
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an issue with the request.');
        typingIndicator.style.display = 'none'; // Hide the indicator on error
    }
}

// Function to reset the character count
function resetCharCount() {
    const maxLength = userInput.getAttribute('maxlength');
    charCount.textContent = `${maxLength} characters remaining`;
}

// Example of dynamically loading messages on page load
document.addEventListener('DOMContentLoaded', () => {
    // Append greeting message
    appendGreetingMessage();

    // Append chatbot's first message
    const welcomeTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    appendMessage('Chatbot', 'Hello! How can I assist you today?', welcomeTimestamp, true);
});

// Add event listener to handle Enter key press
document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action of Enter key (e.g., form submission)
        sendMessage(); // Call sendMessage when Enter is pressed
    }
});

const userInput = document.getElementById('user-input');
const charCount = document.getElementById('char-count');
const maxLength = userInput.getAttribute('maxlength');

// Update the character count as the user types
userInput.addEventListener('input', () => {
    const remaining = maxLength - userInput.value.length;
    charCount.textContent = `${remaining} / 140`;
});