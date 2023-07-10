const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model(
  "RoomCode",
  roomCodeSchema,
  "Created_Room_Codes"
);
