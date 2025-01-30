// src/data/cutsceneMessages.js

/**
 * cutsceneMessages.js
 * 
 * This file exports two arrays:
 * - generalTaunts: Common taunts used across multiple rooms.
 * - roomSpecificTaunts: An object mapping room IDs to their unique taunts.
 * 
 * This structure allows for both general and room-specific taunts with flexibility.
 */

// General taunts applicable to any room
export const generalTaunts = [
    "You thought you could beat me? Think again!",
    "Is that the best you've got?",
    "I'll always be one step ahead of you.",
    "Pathetic attempt!",
    "You're no match for my intelligence.",
    "Keep trying, maybe you'll get it eventually.",
    "Such incompetence is laughable.",
    "I expected more from you.",
    "Don't quit now, or do you?",
    "This is just the beginning of your downfall."
];

// Room-specific taunts, keyed by room ID
export const roomSpecificTaunts = {
    0: [ // Room 1: Binary Puzzle
        "Binary won't save you here!",
        "Even 0s and 1s can't stop me.",
        "Your binary skills are subpar."
    ],
    1: [ // Room 2: Cassette Puzzle
        "Color sorting? Child's play.",
        "Your cassette choices are flawed.",
        "I control the mainframe's rhythm."
    ],
    2: [ // Room 3: Blackjack Puzzle
        "Betting against me? Foolish!",
        "Your cards are stacked against you.",
        "Blackjack is my domain."
    ],
    3: [ // Room 4: Lose-Lose with the Boss
        "You can't win, but you can lose splendidly.",
        "Embrace your inevitable defeat.",
        "Six losses and you're done."
    ]
};

// Top messages applicable to any room
export const generalTopMessages = [
    "System Alert",
    "AI Warning",
    "Critical Message",
    "Security Breach",
    "Hostile Communication",
    "Unauthorized Access",
    "Intrusion Detected",
    "System Override"
];

// Room-specific top messages, keyed by room ID (if needed)
export const roomSpecificTopMessages = {
    0: [
        "Binary Interface",
        "CRT Monitor Error",
        "Data Stream Disruption"
    ],
    1: [
        "Cassette Alignment",
        "Color Calibration Required",
        "Cassette Sorting Protocol"
    ],
    2: [
        "Blackjack Protocol",
        "Security Override Required",
        "Casino Floor Alert"
    ],
    3: [
        "Boss AI Directive",
        "Final Showdown",
        "Defeat Confirmation"
    ]
};
