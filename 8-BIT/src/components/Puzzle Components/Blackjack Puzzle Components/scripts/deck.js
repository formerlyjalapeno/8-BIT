// deck.js

// Generate a standard 52-card deck
export function generateDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    const deck = [];
    suits.forEach((suit) => {
      values.forEach((value) => {
        deck.push({ suit, value });
      });
    });
    return shuffleDeck(deck);
  }
  
  // Shuffle the deck
  export function shuffleDeck(deck) {
    return deck.sort(() => Math.random() - 0.5);
  }
  