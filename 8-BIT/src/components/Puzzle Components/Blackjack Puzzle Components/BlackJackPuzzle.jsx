import { useState, useEffect } from "react";
import { generateDeck } from "./scripts/deck.js";

/**
 * Convert { suit, value } to a card image file path.
 * Example: if you have 2H.png for "2 of hearts", etc.
 */
function getCardImage(card) {
  const suitMap = {
    hearts: "H",
    diamonds: "D",
    clubs: "C",
    spades: "S",
  };
  let valueShort = card.value;
  // If your image files use "T" for "10", etc., adjust here:
  // if (valueShort === "10") valueShort = "T";

  const suitShort = suitMap[card.suit] || "X";

  // e.g. "/cards/2H.png", "/cards/KD.png", etc.
  return `/cards/${valueShort}${suitShort}.png`;
  // return `../../../../public/backcard.png`; // Temporarily always shows backcard
}

const BlackjackGame = ({ onWin }) => {
  // ─────────────────────────────────────────────────────────────────────────────
  //  1) STATE INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────────
  const [playerHands, setPlayerHands] = useState([{ cards: [], bet: 0 }]);
  const [dealerHand, setDealerHand] = useState([]);
  const [deck, setDeck] = useState(generateDeck());
  const [gameState, setGameState] = useState("betting");
  const [chips, setChips] = useState(500);
  const [currentHandIndex, setCurrentHandIndex] = useState(0);
  const [bet, setBet] = useState(0);
  const [lastBet, setLastBet] = useState(0);
  const [history, setHistory] = useState([]);

  const winningChips = 1500;
  
  // ─────────────────────────────────────────────────────────────────────────────
  //  2) LOAD from localStorage on mount
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("blackjackGameData");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed) {
          // Restore each piece if it exists
          if (parsed.playerHands) setPlayerHands(parsed.playerHands);
          if (parsed.dealerHand) setDealerHand(parsed.dealerHand);
          if (parsed.deck) setDeck(parsed.deck);
          if (parsed.gameState) setGameState(parsed.gameState);
          if (typeof parsed.chips === "number") setChips(parsed.chips);
          if (typeof parsed.currentHandIndex === "number")
            setCurrentHandIndex(parsed.currentHandIndex);
          if (typeof parsed.bet === "number") setBet(parsed.bet);
          if (typeof parsed.lastBet === "number") setLastBet(parsed.lastBet);
          if (Array.isArray(parsed.history)) setHistory(parsed.history);
        }
      }
    } catch (error) {
      console.error("Error loading blackjack game data:", error);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  //  3) SAVE to localStorage whenever relevant states change
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saveData = {
        playerHands,
        dealerHand,
        deck,
        gameState,
        chips,
        currentHandIndex,
        bet,
        lastBet,
        history,
      };
      localStorage.setItem("blackjackGameData", JSON.stringify(saveData));
    } catch (error) {
      console.error("Error saving blackjack game data:", error);
    }
  }, [
    playerHands,
    dealerHand,
    deck,
    gameState,
    chips,
    currentHandIndex,
    bet,
    lastBet,
    history,
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  //  4) WIN CONDITION
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (chips >= winningChips) {
      onWin?.();
    }
  }, [chips, winningChips, onWin]);

  // ─────────────────────────────────────────────────────────────────────────────
  //  5) HELPER FUNCTIONS: calculateHandValue, canSplit
  // ─────────────────────────────────────────────────────────────────────────────
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

  const canSplit = (hand) => {
    if (!hand || !hand.cards || hand.cards.length < 2) return false;
    return hand.cards[0].value === hand.cards[1].value;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //  6) HISTORY UPDATER
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  //  7) DEAL INITIAL HANDS
  // ─────────────────────────────────────────────────────────────────────────────
  const dealInitialHands = () => {
    if (bet <= 0) {
      alert("You must place a valid bet first.");
      return;
    }
    if (bet > chips) {
      alert("You cannot bet more than your current chips!");
      return;
    }

    const newDeck = [...deck];
    const playerStart = [newDeck.pop(), newDeck.pop()];
    const dealerStart = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHands([{ cards: playerStart, bet }]);
    setDealerHand(dealerStart);
    setCurrentHandIndex(0);
    setLastBet(bet);

    // Subtract bet from chips
    setChips((prev) => prev - bet);

    const playerTotal = calculateHandValue(playerStart);
    const dealerTotal = calculateHandValue(dealerStart);
    if (!checkForBlackjack(playerTotal, dealerTotal)) {
      setGameState("playing");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //  8) CHECK FOR BLACKJACK
  // ─────────────────────────────────────────────────────────────────────────────
  const checkForBlackjack = (playerTotal, dealerTotal) => {
    if (playerTotal === 21 || dealerTotal === 21) {
      if (playerTotal === 21 && dealerTotal === 21) {
        // Push
        updateHistory("push", 0);
        setChips((prev) => prev + lastBet);
      } else if (playerTotal === 21) {
        // Player Blackjack => 3:2
        const winnings = Math.floor(lastBet * 1.5);
        updateHistory("win", winnings);
        setChips((prev) => prev + lastBet + winnings);
      } else {
        // Dealer Blackjack
        updateHistory("loss", -lastBet);
      }
      setGameState("result");
      return true;
    }
    return false;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //  9) START NEW ROUND
  // ─────────────────────────────────────────────────────────────────────────────
  const startNewRound = () => {
    setPlayerHands([{ cards: [], bet: 0 }]);
    setDealerHand([]);
    setBet(0);
    setLastBet(0);
    setCurrentHandIndex(0);
    setGameState("betting");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 10) PLAYER ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
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

    const playerTotal = calculateHandValue(
      updatedHands[currentHandIndex].cards
    );
    if (playerTotal > 21) {
      endTurn();
    }
  };

  const endTurn = () => {
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1);
    } else {
      playDealerTurn();
    }
  };

  const doubleDown = () => {
    const currentHand = playerHands[currentHandIndex];
    if (currentHand.cards.length !== 2 || chips < currentHand.bet) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop();

    const updatedHands = [...playerHands];
    updatedHands[currentHandIndex].cards.push(newCard);
    updatedHands[currentHandIndex].bet *= 2;

    // Subtract additional bet
    setChips((prev) => prev - currentHand.bet);

    setDeck(newDeck);
    setPlayerHands(updatedHands);

    endTurn();
  };

  const splitHand = () => {
    const handToSplit = playerHands[currentHandIndex];
    if (!canSplit(handToSplit)) return;

    const newHands = [
      ...playerHands.slice(0, currentHandIndex),
      { cards: [handToSplit.cards[0]], bet: handToSplit.bet },
      { cards: [handToSplit.cards[1]], bet: handToSplit.bet },
      ...playerHands.slice(currentHandIndex + 1),
    ];
    setPlayerHands(newHands);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 11) DEALER ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const playDealerTurn = () => {
    let dealerTotal = calculateHandValue(dealerHand);
    const newDeck = [...deck];
    const newDealerHand = [...dealerHand];

    while (dealerTotal < 17) {
      const newCard = newDeck.pop();
      if (!newCard) break;
      newDealerHand.push(newCard);
      dealerTotal = calculateHandValue(newDealerHand);
    }
    setDeck(newDeck);
    setDealerHand(newDealerHand);

    handlePayouts(newDealerHand);
    setGameState("result");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 12) PAYOUTS
  // ─────────────────────────────────────────────────────────────────────────────
  const handlePayouts = (finalDealerHand) => {
    const dealerTotal = calculateHandValue(finalDealerHand);
    let newChipCount = chips;

    playerHands.forEach((hand) => {
      const playerTotal = calculateHandValue(hand.cards);
      const thisBet = hand.bet;

      if (playerTotal > 21) {
        updateHistory("loss", -thisBet);
      } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        updateHistory("win", thisBet * 2);
        newChipCount += thisBet * 2;
      } else if (playerTotal === dealerTotal) {
        updateHistory("push", 0);
        newChipCount += thisBet;
      } else {
        updateHistory("loss", -thisBet);
      }
    });
    setChips(newChipCount);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 13) RENDERING / LAYOUT
  // ─────────────────────────────────────────────────────────────────────────────
  const betContainerClass = `puzzle-blackjack__betting-container ${
    gameState !== "betting"
      ? "puzzle-blackjack__betting-container--disabled"
      : ""
  }`;

  return (
    <div className="puzzle-blackjack__layout">
      {/* ────────── HISTORY SIDEBAR ────────── */}
      <div className="puzzle-blackjack__sidebar puzzle-blackjack__history">
        <h3>Game History</h3>
        <ul>
          {history.map((entry) => (
            <li key={entry.match}>
              Match {entry.match}: {entry.result} - Bet: {entry.bet}, Change:{" "}
              {entry.change}
            </li>
          ))}
        </ul>
      </div>

      {/* ────────── MAIN TABLE AREA ────────── */}
      <div className="puzzle-blackjack__table">
        <div className="puzzle-blackjack">
          <h2>Blackjack</h2>
          <p>Chips: {chips}</p>
          <p>Goal: {winningChips} Chips</p>

          {/* BET PANEL (only if betting) */}
          <div className={betContainerClass}>
            <input
              type="number"
              className="puzzle-blackjack__betting-input"
              value={bet === 0 ? "" : bet}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (isNaN(value) || value < 0) value = 0;
                if (value > chips) value = chips;
                setBet(value);
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

          {/* DEALER SECTION */}
          {gameState !== "betting" && (
            <div className="puzzle-blackjack__game__dealer">
              <h3>Dealer's Hand</h3>
              <div className="puzzle-blackjack__cards-row">
                {gameState === "playing"
                  ? dealerHand.map((card, index) =>
                      index === 0 ? (
                        <img
                          key={index}
                          src={getCardImage(card)}
                          alt={`${card.value} of ${card.suit}`}
                          className="puzzle-blackjack__card"
                        />
                      ) : (
                        <img
                          key={index}
                          src="../../../../public/backcard.png"
                          alt="Hidden Card"
                          className="puzzle-blackjack__card"
                        />
                      )
                    )
                  : // If gameState === "result", show all dealer cards
                    dealerHand.map((card, index) => (
                      <img
                        key={index}
                        src={getCardImage(card)}
                        alt={`${card.value} of ${card.suit}`}
                        className="puzzle-blackjack__card"
                      />
                    ))}
              </div>
              {gameState === "result" && (
                <p>Total: {calculateHandValue(dealerHand)}</p>
              )}
            </div>
          )}

          {/* RESULT */}
          {gameState === "result" && (
            <div className="puzzle-blackjack__result">
              <div className="puzzle-blackjack__game__player-hands">
                {playerHands.map((hand, index) => (
                  <div
                    key={index}
                    className="puzzle-blackjack__game__player-hand"
                  >
                    <h3>Hand {index + 1}</h3>
                    <div className="puzzle-blackjack__cards-row">
                      {hand.cards.map((card, idx) => (
                        <img
                          key={idx}
                          src={getCardImage(card)}
                          alt={`${card.value} of ${card.suit}`}
                          className="puzzle-blackjack__card"
                        />
                      ))}
                    </div>
                    <p>Total: {calculateHandValue(hand.cards)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons only appear if gameState === "playing" or "result" */}
          {["playing", "result"].includes(gameState) && (
            <div className="puzzle-blackjack__game__actions">
              <button
                className="puzzle-blackjack__game__actions__hit"
                onClick={playerHit}
                disabled={gameState !== "playing"}
              >
                Hit
              </button>
              <button
                className="puzzle-blackjack__game__actions__stand"
                onClick={endTurn}
                disabled={gameState !== "playing"}
              >
                Stand
              </button>

              {/* Always visible, disabled if can't split or not playing */}
              <button
                className="puzzle-blackjack__game__actions__split"
                onClick={splitHand}
                disabled={
                  gameState !== "playing" ||
                  !canSplit(playerHands[currentHandIndex])
                }
              >
                Split
              </button>

              {/* Always visible, disabled if not valid or not playing */}
              <button
                className="puzzle-blackjack__game__actions__doubledown"
                onClick={doubleDown}
                disabled={
                  gameState !== "playing" ||
                  playerHands[currentHandIndex].cards.length !== 2 ||
                  chips < playerHands[currentHandIndex].bet
                }
              >
                Double Down
              </button>

              {/* New Round always visible if in the "playing"/"result" block
                  but only clickable if gameState === "result" */}
              <button
                className="puzzle-blackjack__game__actions__newround"
                onClick={startNewRound}
                disabled={gameState !== "result"}
              >
                New Round
              </button>
            </div>
          )}

          {/* PLAYING: Show player's hands only if playing */}
          {gameState === "playing" && (
            <div className="puzzle-blackjack__game">
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
                    <div className="puzzle-blackjack__cards-row">
                      {hand.cards.map((card, idx) => (
                        <img
                          key={idx}
                          src={getCardImage(card)}
                          alt={`${card.value} of ${card.suit}`}
                          className="puzzle-blackjack__card"
                        />
                      ))}
                    </div>
                    <p>Bet: {hand.bet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;
