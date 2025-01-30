// src/components/scripts/messageUtils.js

/**
 * Selects a random message from the provided array without repeating until all messages have been used.
 * @param {string[]} messages - Array of possible messages.
 * @param {string[]} usedMessages - Array of messages that have already been used.
 * @returns {string} - A randomly selected message.
 */
export const getRandomMessage = (messages, usedMessages) => {
    // If all messages have been used, reset the usedMessages array
    if (usedMessages.length === messages.length) {
        usedMessages.length = 0; // Clears the array
    }

    let message;
    // Keep selecting a random message until one that's not been used is found
    do {
        const randomIndex = Math.floor(Math.random() * messages.length);
        message = messages[randomIndex];
    } while (usedMessages.includes(message));

    // Add the selected message to usedMessages
    usedMessages.push(message);
    return message;
};
