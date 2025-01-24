import { useState } from "react";
import { generateDeck } from "./scripts/deck.js";
import "../../../styles/puzzleBlackjack.scss";

const BlackjackGame = ({ onWinGame }) => {
  const [playerHands, setPlayerHands] = useState([{ cards: [], bet: 0 }]);
  const [dealerHand, setDealerHand] = useState([]);
  const [deck, setDeck] = useState(generateDeck());
  const [gameState, setGameState] = useState("betting");
  const [chips, setChips] = useState(50);
  const [currentHandIndex, setCurrentHandIndex] = useState(0);
  const [bet, setBet] = useState(0);
  const [lastBet, setLastBet] = useState(0);
  const [history, setHistory] = useState([]);
  const winningChips = 100;

  function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;
    hand.forEach((card) => {
      if (["J", "Q", "K"].includes(card.value)) {
        total += 10;
      } else if (card.value === "A") {
        aces += 1;
        total += 11;
      } else {
        total += parseInt(card.value, 10);
      }
    });
    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }
    return total;
  }

  // Safe check in canSplit:
  const canSplit = (hand) => {
    // Ensure hand exists, has at least 2 cards
    if (!hand || !hand.cards || hand.cards.length < 2) {
      return false;
    }
    // Ensure both cards are defined
    if (!hand.cards[0] || !hand.cards[1]) {
      return false;
    }
    return hand.cards[0].value === hand.cards[1].value;
  };

  const dealInitialHands = () => {
    const newDeck = [...deck];
    const playerStart = [newDeck.pop(), newDeck.pop()];
    const dealerStart = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setPlayerHands([{ cards: playerStart, bet }]);
    setDealerHand(dealerStart);
    setCurrentHandIndex(0);
    setLastBet(bet);

    const playerTotal = calculateHandValue(playerStart);
    const dealerTotal = calculateHandValue(dealerStart);
    if (!checkForBlackjack(playerTotal, dealerTotal)) {
      setGameState("playing");
    }
  };

  const checkForBlackjack = (playerTotal, dealerTotal) => {
    if (playerTotal === 21 || dealerTotal === 21) {
      if (playerTotal === 21 && dealerTotal === 21) {
        updateHistory("push", 0);
        setChips((prev) => prev + lastBet);
        setGameState("result");
      } else if (playerTotal === 21) {
        const winnings = lastBet * 1.5;
        updateHistory("win", winnings);
        setChips((prev) => prev + winnings);
        setGameState("result");
      } else {
        updateHistory("loss", -lastBet);
        setGameState("result");
      }
      return true;
    }
    return false;
  };

  // Additional safety in splitHand:
  const splitHand = () => {
    const handToSplit = playerHands[currentHandIndex];
    // Re-check canSplit to avoid referencing cards[1] if it doesn't exist
    if (!canSplit(handToSplit)) {
      return;
    }

    const newHands = [
      ...playerHands.slice(0, currentHandIndex),
      { cards: [handToSplit.cards[0]], bet: handToSplit.bet },
      { cards: [handToSplit.cards[1]], bet: handToSplit.bet },
      ...playerHands.slice(currentHandIndex + 1),
    ];
    setPlayerHands(newHands);
  };

  const playerHit = () => {
    if (gameState !== "playing") return;
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    if (!newCard) {
      alert("Deck is empty! Cannot draw a card.");
      return;
    }

    const updatedHands = [...playerHands];
    updatedHands[currentHandIndex].cards.push(newCard);
    setDeck(newDeck);
    setPlayerHands(updatedHands);

    const playerTotal = calculateHandValue(updatedHands[currentHandIndex].cards);
    if (playerTotal === 21) {
      const winnings = lastBet * 1.5;
      updateHistory("win", winnings);
      setChips((prev) => prev + winnings);
      setGameState("result");
    } else if (playerTotal > 21) {
      endTurn();
    }
  };

  const doubleDown = () => {
    if (playerHands[currentHandIndex].cards.length !== 2 || chips < bet) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const updatedHands = [...playerHands];
    updatedHands[currentHandIndex].cards.push(newCard);
    updatedHands[currentHandIndex].bet *= 2;
    setDeck(newDeck);
    setPlayerHands(updatedHands);
    setChips(chips - bet);
    endTurn();
  };

  const endTurn = () => {
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1);
    } else {
      playDealerTurn();
    }
  };

  const playDealerTurn = () => {
    let dealerTotal = calculateHandValue(dealerHand);
    const newDeck = [...deck];
    const newDealerHand = [...dealerHand];
    while (dealerTotal < 17) {
      const newCard = newDeck.pop();
      newDealerHand.push(newCard);
      dealerTotal = calculateHandValue(newDealerHand);
    }
    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setGameState("result");
  };

  const updateHistory = (result, amount) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        match: prevHistory.length + 1,
        result: result === "win" ? "Win" : result === "push" ? "Push" : "Loss",
        bet: lastBet,
        change: amount,
      },
    ]);
  };

  const handlePayouts = () => {
    const dealerTotal = calculateHandValue(dealerHand);
    const updatedChips = playerHands.reduce((total, hand) => {
      const playerTotal = calculateHandValue(hand.cards);
      if (playerTotal > 21) {
        updateHistory("loss", -hand.bet);
        return total;
      } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        updateHistory("win", hand.bet * 2);
        return total + hand.bet * 2;
      } else if (playerTotal === dealerTotal) {
        updateHistory("push", 0);
        return total + hand.bet;
      } else {
        updateHistory("loss", -hand.bet);
        return total;
      }
    }, chips);

    setChips(updatedChips);
    setGameState("betting");
  };

  // For the bet container, we apply a `--disabled` if `gameState !== 'betting'`
  const betContainerClass = `puzzle-blackjack__betting-container ${
    gameState !== "betting" ? "puzzle-blackjack__betting-container--disabled" : ""
  }`;

  return (
    <div className="puzzle-blackjack__layout">
      {/* MAIN TABLE AREA */}
      <div className="puzzle-blackjack__table">
        <div className="puzzle-blackjack">
          <h2>Blackjack</h2>
          <p>Chips: {chips}</p>
          <p>Goal: {winningChips} Chips</p>

          {gameState === "result" && (
            <div className="puzzle-blackjack__result">
              <h3>Result</h3>
              <div className="puzzle-blackjack__result__dealer">
                <h3>Dealer's Hand</h3>
                <div>
                  {dealerHand.map((card) => `${card.value} of ${card.suit}`).join(", ")}
                </div>
                <p>Total: {calculateHandValue(dealerHand)}</p>
              </div>
              <div className="puzzle-blackjack__result__player-hands">
                {playerHands.map((hand, index) => (
                  <div key={index} className="puzzle-blackjack__result__player-hand">
                    <h3>Hand {index + 1}</h3>
                    <div>
                      {hand.cards.map((card) => `${card.value} of ${card.suit}`).join(", ")}
                    </div>
                    <p>Total: {calculateHandValue(hand.cards)}</p>
                  </div>
                ))}
              </div>
              <button onClick={handlePayouts}>Continue</button>
            </div>
          )}

          {gameState === "playing" && (
            <div className="puzzle-blackjack__game">
              <div className="puzzle-blackjack__game__dealer">
                <h3>Dealer's Hand</h3>
                <div>
                  {dealerHand
                    .map((card, index) =>
                      index === 0 ? `${card.value} of ${card.suit}` : "Hidden"
                    )
                    .join(", ")}
                </div>
              </div>
              <div className="puzzle-blackjack__game__player-hands">
                {playerHands.map((hand, index) => (
                  <div
                    key={index}
                    className={`puzzle-blackjack__game__player-hand ${
                      index === currentHandIndex
                        ? "puzzle-blackjack__game__player-hand--active"
                        : ""
                    }`}
                  >
                    <h3>Hand {index + 1}</h3>
                    <div>
                      {hand.cards.map((card) => `${card.value} of ${card.suit}`).join(", ")}
                    </div>
                    <p>Total: {calculateHandValue(hand.cards)}</p>
                    <p>Bet: {hand.bet}</p>
                  </div>
                ))}
              </div>
              <div className="puzzle-blackjack__actions">
                <button onClick={playerHit}>Hit</button>
                <button onClick={endTurn}>Stand</button>
                {canSplit(playerHands[currentHandIndex]) && (
                  <button onClick={splitHand}>Split</button>
                )}
                {playerHands[currentHandIndex].cards.length === 2 && (
                  <button onClick={doubleDown}>Double Down</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR: Bet + History */}
      <div className="puzzle-blackjack__sidebar">
        {/* Always Render Bet Container, but apply disabled if gameState !== betting */}
        <div className="puzzle-blackjack__sidebar-container">
          <div className={betContainerClass}>
            <input
              type="number"
              className="puzzle-blackjack__betting-input"
              value={bet === 0 ? "" : bet}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") setBet(0);
                else if (!isNaN(value) && parseInt(value, 10) >= 0) setBet(parseInt(value, 10));
              }}
              placeholder="Place your bet"
            />
            <button
              className="puzzle-blackjack__betting-button"
              onClick={dealInitialHands}
            >
              Bet
            </button>
          </div>
        </div>

        <div className="puzzle-blackjack__sidebar-container puzzle-blackjack__history">
          <h3>Game History</h3>
          <ul>
            {history.map((entry) => (
              <li key={entry.match}>
                Match {entry.match}: {entry.result} - Bet: {entry.bet}, Change: {entry.change}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;
