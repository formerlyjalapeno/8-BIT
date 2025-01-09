// roomsData.js
const roomsData = [
  {
    id: 0,
    backgroundWithItem: "/room-1-with-item.png",
    backgroundWithoutItem: "/room-1-without-item.png",
    items: [0], // IDs of items present in room 1
    questions: [0], // IDs of questions in room 1
    class: "room__container__next-button__room1", // Custom class for room 1
  },
  {
    id: 1,
    backgroundWithItem: "/room-2-with-item.png",
    backgroundWithoutItem: "/room-2-without-item.png",
    items: [1],
    questions: [1],
    class: "room__container__next-room_1-button", // Custom class for room 2
  },
  // Add more rooms as needed
];

export default roomsData;
