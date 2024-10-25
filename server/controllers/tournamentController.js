// Tournament Controller (controllers/tournamentController.js)
const Tournament = require("../Modal/Tournament");
const mongoose = require("mongoose");
const multer = require("multer");

// Configure multer for memory storage instead of disk storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

exports.upload = upload;

// Create tournament
exports.createTournament = async (req, res) => {
  try {
    console.log("Starting tournament creation process...");
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    // Validate required fields
    if (
      !req.body.tournamentname ||
      !req.body.tournamenttype ||
      !req.body.managerId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields (tournamentname, tournamenttype, or managerId) are missing",
      });
    }

    // Parse time data
    let timeData;
    try {
      timeData = JSON.parse(req.body.selecttime);
    } catch (error) {
      console.error("Error parsing time data:", error);
      return res.status(400).json({
        success: false,
        message: "Invalid time format",
      });
    }

    // Parse court data
    let courtData;
    try {
      courtData = JSON.parse(req.body.selectcourt);
    } catch (error) {
      console.error("Error parsing court data:", error);
      return res.status(400).json({
        success: false,
        message: "Invalid court format",
      });
    }

    // Prepare tournament data
    const tournamentData = {
      tournamentname: req.body.tournamentname,
      tournamenttype: req.body.tournamenttype,
      eventdescription: req.body.eventdescription || "",
      eventlocation: req.body.eventlocation,
      cancellationpolicy: req.body.cancellationpolicy,
      selectcourt: courtData,
      selecttime: timeData,
      allday: req.body.allday === "true",
      managerId: req.body.managerId, // Include managerId in the data
    };

    // Handle image if it exists
    if (req.file) {
      tournamentData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Create and save tournament
    const tournament = new Tournament(tournamentData);
    await tournament.save();

    // Prepare response data without the binary image data
    const responseData = tournament.toObject();
    if (responseData.image) {
      // Convert binary image to base64 for response
      responseData.imageBase64 = `data:${
        responseData.image.contentType
      };base64,${responseData.image.data.toString("base64")}`;
      delete responseData.image; // Remove binary data from response
    }

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Tournament creation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed: " + error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating tournament",
      error: error.message,
    });
  }
};

// Get tournament history
exports.getTournamentHistory = async (req, res) => {
  try {
    // Fetch all tournaments, sorted by creation date
    const tournaments = await Tournament.find().sort({ createdAt: -1 });

    // Map tournaments to format data for response
    const formattedTournaments = tournaments.map((tournament) => {
      const tournamentObj = tournament.toObject();

      // Convert binary image to base64 if it exists
      if (tournamentObj.image && tournamentObj.image.data) {
        tournamentObj.imageBase64 = `data:${
          tournamentObj.image.contentType
        };base64,${tournamentObj.image.data.toString("base64")}`;
        delete tournamentObj.image; // Remove binary data from response
      }

      return {
        ...tournamentObj,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedTournaments,
    });
  } catch (error) {
    console.error("Error fetching tournament history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching tournament history",
      error: error.message,
    });
  }
};

// Fetch tournament by ID
// Assuming you have already defined the Tournament model
exports.getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received tournament ID:", id); // Debug log

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tournament ID",
      });
    }

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    // Return only the tournament ID
    res.status(200).json({
      success: true,
      tournamentId: tournament._id,
    });
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching tournament",
      error: error.message,
    });
  }
};

// Add group to tournament
exports.addGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    tournament.groups.push({ name: groupName });
    await tournament.save();

    res.status(201).json({
      success: true,
      message: "Group added successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error adding group:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding group",
      error: error.message,
    });
  }
};

// Edit group in tournament
exports.editGroup = async (req, res) => {
  try {
    const { id, groupId } = req.params;
    const { groupName } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    group.name = groupName;
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error editing group:", error);
    return res.status(500).json({
      success: false,
      message: "Error editing group",
      error: error.message,
    });
  }
};

// Delete group from tournament
exports.deleteGroup = async (req, res) => {
  try {
    const { id, groupId } = req.params;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    group.remove();
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting group",
      error: error.message,
    });
  }
};

// Add team to tournament
exports.addTeam = async (req, res) => {
  try {
    const { id, groupId } = req.params;
    const { teamName } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    group.teams.push({ name: teamName });
    await tournament.save();

    res.status(201).json({
      success: true,
      message: "Team added successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error adding team:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding team",
      error: error.message,
    });
  }
};

// Edit team in tournament
exports.editTeam = async (req, res) => {
  try {
    const { id, groupId, teamId } = req.params;
    const { teamName } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const team = group.teams.id(teamId);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    team.name = teamName;
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error editing team:", error);
    return res.status(500).json({
      success: false,
      message: "Error editing team",
      error: error.message,
    });
  }
};

// Delete team from tournament
exports.deleteTeam = async (req, res) => {
  try {
    const { id, groupId, teamId } = req.params;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const team = group.teams.id(teamId);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    team.remove();
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting team",
      error: error.message,
    });
  }
};

// Add player to team
exports.addPlayer = async (req, res) => {
  try {
    const { id, groupId, teamId } = req.params;
    const { playerName } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const team = group.teams.id(teamId);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    team.players.push({ name: playerName });
    await tournament.save();

    res.status(201).json({
      success: true,
      message: "Player added successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error adding player:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding player",
      error: error.message,
    });
  }
};

// Edit player in team
exports.editPlayer = async (req, res) => {
  try {
    const { id, groupId, teamId, playerId } = req.params;
    const { playerName } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const team = group.teams.id(teamId);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }

    player.name = playerName;
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Player updated successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error editing player:", error);
    return res.status(500).json({
      success: false,
      message: "Error editing player",
      error: error.message,
    });
  }
};

// Delete player from team
exports.deletePlayer = async (req, res) => {
  try {
    const { id, groupId, teamId, playerId } = req.params;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    const group = tournament.groups.id(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const team = group.teams.id(teamId);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    const player = team.players.id(playerId);
    if (!player) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }

    player.remove();
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Player deleted successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("Error deleting player:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting player",
      error: error.message,
    });
  }
};
