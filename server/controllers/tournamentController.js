// Tournament Controller (controllers/tournamentController.js)
const Tournament = require("../Modal/Tournament");
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
