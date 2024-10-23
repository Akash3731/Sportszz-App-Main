// const mongoose = require("mongoose");

// const TournamentSchema = new mongoose.Schema({
//   tournamentname: {
//     type: String,
//     required: true,
//   },
//   image: { type: String },
//   date: {
//     type: String,
//     required: true,
//   },
//   enddate: {
//     type: String,
//     required: true,
//   },
//   numberofteams: {
//     type: Number,
//     required: true,
//   },
//   tournamenttype: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model("Tournament", TournamentSchema);

const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
  tournamentname: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer, // Store the image binary data
    contentType: String, // Store the image MIME type
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
});

module.exports = mongoose.model("Tournament", TournamentSchema);
