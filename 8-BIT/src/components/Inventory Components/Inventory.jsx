// inventory.jsx
const Inventory = ({ items }) => {
    const slotCount = 5; // number of slots you want to display at all times
  
    // Generate an array of the desired number of slots
    const slots = [];
    for (let i = 0; i < slotCount; i++) {
      const currentItem = items[i]; // might be undefined if no item at this index
      slots.push(
        <div key={i} className="inventory__container__slot">
          {currentItem ? <p>{currentItem.name}</p> : null}
        </div>
      );
    }
  
    return (
      <section className="inventory">
        <article className="inventory__container">
          {slots}
        </article>
      </section>
    );
  };
  
  export default Inventory;
  