// roomsData.js
const roomsData = [
  {
    id: 0,
    backgroundWithItem: "/room-1-with-item.png",
    backgroundWithoutItem: "/room-1-without-item.png",
    items: [0], // or whatever items you have for Room 1
    questions: [0],
    class: "room__container__next-button__room1",
  },
  {
    id: 1,
    // Use the same image for "with item" and "without item,"
    // because there are no items in Room 2
    backgroundWithItem: "/room-2.png",
    backgroundWithoutItem: "/room-2.png",
    items: [], // No items in Room 2
    questions: [], // If you have no questions for Room 2, set this empty
    class: "room__container__next-button__room2",
  },
  {
    id: 2,
    // Use the same image for "with item" and "without item,"
    // because there are no items in Room 2
    backgroundWithItem: "/room-3.png",
    backgroundWithoutItem: "/room-3.png",
    items: [], // No items in Room 3
    questions: [], // If you have no questions for Room 3, set this empty
    class: "room__container__next-button__room3",
  },
  // Additional rooms...
];
  
export default roomsData;
