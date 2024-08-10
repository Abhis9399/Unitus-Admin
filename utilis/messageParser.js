// utils/messageParser.js
export function parseMessage(message) {
  const regex = /Price:(\d+),Capacity:(\d+),Material:(\w+)/;
  const match = message.match(regex);

  if (!match) {
    throw new Error('Message format is incorrect');
  }

  return {
    price: match[1],
    capacity: match[2],
    material: match[3],
  };
}
