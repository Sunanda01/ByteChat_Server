const Message = require("../models/messageModel");

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messageByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort((a, b) => {
    const [aMonth, aDay, aYear] = a._id.split("/").map(Number);
    const [bMonth, bDay, bYear] = b._id.split("/").map(Number);

    const dateA = new Date(aYear, aMonth - 1, aDay);
    const dateB = new Date(bYear, bMonth - 1, bDay);

    return dateA - dateB; // Ascending order
  });
}

module.exports = { getLastMessagesFromRoom, sortRoomMessagesByDate };
