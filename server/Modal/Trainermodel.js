const mongoose = require("mongoose");

const TrainermodelSchema = new mongoose.Schema({
  trainerID: {
    type: String,
    required: true,
    unique: true
},
trainerName: {
    type: String,
    required: true
},
dateOfBirth: {
    type: Date,
    required: true
},
age: {
    type: Number,
    required: true
},
sex: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
},
sports: {
    type: [String],
    required: true
},
clubNames: {
    type: [String]
},
contactNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
},
emergencyContactNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
},
email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/
},
photo: {
    type: String // Can store a URL or base64 encoded string
},
address: {
    type: String,
    required: true
},
rank: {
    type: String,
    enum: ['Local', 'District', 'State', 'National'],
    required: true
},
certificates: {
    type: [String] // Could be an array of URLs or file paths
},
achievements: {
    type: [String] // List of achievements
},
identityCardType: {
    type: String,
    required: true
},
identityID: {
    type: String,
    required: true
},
locations: {
    type: [String], // Array to store multiple locations
    required: true
},
authorization: {
    type: Boolean,
    default: false
},
referralCode: {
    type: String
}
}, { timestamps: true });

const Trainermodel = mongoose.model("Trainermodel", TrainermodelSchema);

module.exports = Trainermodel;
