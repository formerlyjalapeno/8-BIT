// ItemOverlay.jsx
import React from "react";
import Items from "./scripts/items"; // Import your global items data

const ItemOverlay = ({ activeItemId, onClose }) => {
  if (activeItemId === null) return null; // No item selected, no overlay

  const currentItem = Items.find((itm) => itm.id === activeItemId);
  if (!currentItem) return null; // Safety check

  return (
    <div className="room__container__item__overlay">
      <div className="room__container__item__overlay__content">
        <h2>{currentItem.name}</h2>
        <img
          className="room__container__item__overlay__content__image"
          src="/binary-pixel.png"
          alt=""
        />
        <button onClick={onClose}>I'll be using that later.</button>
      </div>
    </div>
  );
};

export default ItemOverlay;