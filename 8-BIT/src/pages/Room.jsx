import { useState } from "react";
import Items from "../components/Inventory Components/scripts/items"; // Adjust the import path as needed
import Inventory from "../components/Inventory Components/Inventory";

const Room = () => {
  // Just store the IDs of items available in this room
  const [roomItemIds, setRoomItemIds] = useState([0, 1]);

  const [playerInventory, setPlayerInventory] = useState([]);

  const collectItem = (id) => {
    // Find the item from the global Items array by ID
    const collectedItem = Items.find((itm) => itm.id === id);

    // Add the found item to the player's inventory
    setPlayerInventory((prevInv) => [...prevInv, collectedItem]);

    // Remove that item's ID from the room's item list, so the button disappears
    setRoomItemIds((prevRoomIds) => prevRoomIds.filter((itemId) => itemId !== id));
  };

  return (
    <main className="room__Container">
      <p>This is a room</p>

      {/* Loop through the item IDs in this room */}
      {roomItemIds.map((itemId) => {
        // Find the item from Items
        const currentItem = Items.find((itm) => itm.id === itemId);

        return (
          <button className={currentItem.class} key={currentItem.id} onClick={() => collectItem(currentItem.id)}>
            Collect {currentItem.name}
          </button>
        );
      })}

      <Inventory items={playerInventory} />
    </main>
  );
};

export default Room;
