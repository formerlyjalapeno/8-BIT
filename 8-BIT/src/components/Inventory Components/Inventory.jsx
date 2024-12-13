// Inventory.jsx
const Inventory = ({ items, onInspectItem }) => {
  const slotCount = 5; // always show 5 slots
  const slots = [];

  for (let i = 0; i < slotCount; i++) {
    const currentItem = items[i];
    slots.push(
      <div
        key={i}
        className="inventory__container__slot"
        onClick={() => {
          if (currentItem && currentItem.inspectable) {
            onInspectItem(currentItem.id);
          }
        }}
      >
        {currentItem ? (
          <img
            className={`inventory__container__slot__${currentItem.id}`}
            src={currentItem.img}
          ></img>
        ) : null}
      </div>
    );
  }

  return (
    <section className="inventory">
      <article className="inventory__container">{slots}</article>
    </section>
  );
};

export default Inventory;
