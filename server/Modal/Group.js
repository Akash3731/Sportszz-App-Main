const mongoose = require("mongoose");
const Team = require("./Team"); // Import the Team model

// Define Group schema
const GroupSchema = new mongoose.Schema({
  groupname: {
    type: String,
    required: true,
  },
  teams: [Team.schema], // Reference the Team schema
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

// Check if the Group model already exists
const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

// Export Group model
module.exports = Group;
