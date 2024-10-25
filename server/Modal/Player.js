const mongoose = require("mongoose");

// Define Player schema
const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
});

// Check if the Player model already exists
const Player = mongoose.models.Player || mongoose.model("Player", PlayerSchema);

// Export Player model
module.exports = Player;
