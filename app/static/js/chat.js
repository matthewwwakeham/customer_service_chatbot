const messagesDiv = document.getElementById('messages');

// Function to append messages to the chat
function appendMessage(sender, message) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('message');

    // Create and append the name div for the bot (but not for the user)
    if (sender === 'Chatbot') {
        const nameElem = document.createElement('div');
        nameElem.classList.add('message-name');
        nameElem.textContent = 'Leo'; // Set name for the bot
        messageElem.appendChild(nameElem);
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

    // Append the new message to the messages container
    messagesDiv.appendChild(messageElem);

    // Scroll to the bottom of the messages container
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
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
        appendMessage('Chatbot', data.response);  // Append the bot's response after receiving it
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an issue with the request.');
    }
}

// Example of dynamically loading messages on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initially, you might want to load some starting messages
    appendMessage('Chatbot', 'Hello! How can I assist you today?');
});

// Add event listener to handle Enter key press
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action of Enter key (e.g., form submission)
        sendMessage(); // Call sendMessage when Enter is pressed
    }
});