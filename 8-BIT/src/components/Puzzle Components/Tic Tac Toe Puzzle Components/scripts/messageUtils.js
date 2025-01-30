// src/components/scripts/messageUtils.js

export const getRandomMessage = (messages, usedMessages) => {
    if (usedMessages.length === messages.length) {
        usedMessages.length = 0; // Reset when all messages have been used
    }

    let message;
    do {
        message = messages[Math.floor(Math.random() * messages.length)];
    } while (usedMessages.includes(message));

    usedMessages.push(message);
    return message;
};
