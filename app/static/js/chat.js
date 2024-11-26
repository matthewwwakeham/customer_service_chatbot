const messagesDiv = document.getElementById('messages');

// Function to append messages to the chat with delay for name and message
function appendMessage(sender, message, immediate = false) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('message');

    // Create and append the name div for the bot (but not for the user)
    const nameElem = document.createElement('div');
    nameElem.classList.add('message-name');
    if (sender === 'Chatbot') {
        nameElem.textContent = 'Leo'; // Set name for the bot
    }

    // Create and append the message text div
    const messageTextElem = document.createElement('div');
    messageTextElem.classList.add('message-text');
    messageTextElem.textContent = message;

    // Add specific class based on sender (user or chatbot)
    if (sender === 'You') {
        messageElem.classList.add('user'); 
    } else {
        messageElem.classList.add('bot'); 
    }

    // Append the message text inside the message element
    messageElem.appendChild(messageTextElem);

    // Append the name and message text inside the message element
    if (sender === 'Chatbot' && !immediate) {
        // Delay appending name with message if not immediate
        setTimeout(() => {
            messageElem.insertBefore(nameElem, messageTextElem);
            messagesDiv.appendChild(messageElem);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 1500); // 1.5 seconds delay (adjust as needed)
    } else {
        // Append both immediately for the welcome message
        messageElem.insertBefore(nameElem, messageTextElem);
        messagesDiv.appendChild(messageElem);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Function to handle the send message button click
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim(); // Trim input to avoid empty or space-only messages

    // Prevent sending empty messages
    if (!message) return;

    // Append the user's message to the chat
    appendMessage('You', message);

    // Clear the input field after appending the message
    userInput.value = '';

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
            appendMessage('Chatbot', data.response);
        }, 1500); // 1.5 seconds delay (adjust as needed)
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an issue with the request.');
        typingIndicator.style.display = 'none'; // Hide the indicator on error
    }
}

// Example of dynamically loading messages on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initially, you might want to load some starting messages
    appendMessage('Chatbot', 'Hello! How can I assist you today?', true); // Show instantly with name
});

// Add event listener to handle Enter key press
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action of Enter key (e.g., form submission)
        sendMessage(); // Call sendMessage when Enter is pressed
    }
});

// Adjust the height of the input field dynamically as the user types
const userInput = document.getElementById('user-input');

userInput.addEventListener('input', function () {
    this.style.height = 'auto';  // Reset height to auto to shrink if text is deleted
    this.style.height = (this.scrollHeight) + 'px';  // Set height based on the content's scroll height
});
