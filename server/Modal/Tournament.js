const mongoose = require("mongoose");
const GroupSchema = require("./Group"); // Import the Group model

const TournamentSchema = new mongoose.Schema(
  {
    tournamentname: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    tournamenttype: {
      type: String,
      enum: ["Double Elimination", "Single Elimination", "Round Robin"],
      required: true,
    },
    eventdescription: {
      type: String,
    },
    selectcourt: {
      name: {
        type: String,
        required: true,
      },
    },
    selecttime: {
      timeSlot: {
        type: String,
        enum: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
        required: true,
      },
      period: {
        type: String,
        enum: ["AM", "PM"],
        required: true,
      },
    },
    allday: {
      type: Boolean,
      default: false,
    },
    cancellationpolicy: {
      type: String,
      enum: ["Strict", "Flexible"],
      required: true,
    },
    eventlocation: {
      type: String,
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      required: true,
    },
    groups: [GroupSchema], // Reference the Group schema
  },
  { timestamps: true }
);

// Check if the Tournament model already exists
const Tournament =
  mongoose.models.Tournament || mongoose.model("Tournament", TournamentSchema);

// Export Tournament model
module.exports = Tournament;
