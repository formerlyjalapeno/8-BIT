const roomsData = [
  {
    id: 0,
    backgroundWithItem: "/room-1-with-item.png",
    backgroundWithoutItem: "/room-1-without-item.png",
    items: [0], // This room starts with item ID 0
    questions: [0], // This room has question ID 0
  },
  {
    id: 1,
    backgroundWithItem: "/room-2-with-item.png",
    backgroundWithoutItem: "/room-2-without-item.png",
    items: [1, 2], // This room has items ID 1 and 2
    questions: [1], // This room has question ID 1
  },
  // Add more rooms as needed
];

export default roomsData;
