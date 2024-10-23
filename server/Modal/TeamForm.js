const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamID: {
      type: String,
      required: true,
      unique: true,
    },
    sportID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport", // Assuming there's a Sport model
      required: true,
    },
    matchTypeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchType", // Assuming there's a MatchType model
      required: true,
    },
    numberOfPlayers: {
      type: Number,
      required: true,
    },
    teamCaptain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player", // Assuming the team captain is a player
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player", // List of player IDs
      },
    ],
    authorizations: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user creating the team
      required: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
