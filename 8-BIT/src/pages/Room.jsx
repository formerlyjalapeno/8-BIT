import { useState } from "react";
import Inventory from "../components/Inventory Components/Inventory";

const Room = () => {
  // Define all items available in this room
  const [roomItems, setRoomItems] = useState([
    { id: 0, name: "item_1", item: "test_item", collected: false },
    { id: 1, name: "item_2", item: "test_item", collected: false },
    // You can add more items here if you like
  ]);

  const [playerInventory, setPlayerInventory] = useState([]);

  const collectItem = (id) => {
    // Update the roomItems array: find the item and mark it collected
    setRoomItems((prevItems) =>
      prevItems.map((itm) =>
        itm.id === id ? { ...itm, collected: true } : itm
      )
    );

    // Add the item to the playerInventory
    const collectedItem = roomItems.find((itm) => itm.id === id);
    setPlayerInventory((prevInv) => [...prevInv, collectedItem]);
  };

  return (
    <main className="room__Container">
      <p>This is a room</p>

      {/* Loop through all items and render a button if it's not collected */}
      {roomItems.map((item) => {
        if (!item.collected) {
          return (
            <button key={item.id} onClick={() => collectItem(item.id)}>
              Collect {item.name}
            </button>
          );
        }
        return null; // Don't show a button if it's collected
      })}

      <Inventory items={playerInventory} />
    </main>
  );
};

export default Room;
