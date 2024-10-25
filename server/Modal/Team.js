const mongoose = require("mongoose");
const Player = require("./Player"); // Import the Player model

// Define Team schema
const TeamSchema = new mongoose.Schema({
  teamname: {
    type: String,
    required: true,
  },
  players: [Player.schema], // Reference the Player schema
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
});

// Check if the Team model already exists
const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);

// Export Team model
module.exports = Team;
