// Tournament Controller (controllers/tournamentController.js)
const Tournament = require("../Modal/Tournament");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // Using promises version for cleaner async/await

// Ensure uploads directory exists with proper permissions
const uploadDir = "uploads/";
const ensureUploadsDir = async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true, mode: 0o755 });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
};
ensureUploadsDir();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `tournament-${uniqueSuffix}${fileExt}`;
    cb(null, filename);
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

exports.upload = upload;

exports.createTournament = async (req, res) => {
  try {
    console.log("Starting tournament creation process...");
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    // Validate required fields
    if (!req.body.tournamentname || !req.body.tournamenttype) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
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
    };

    // Handle image if it exists
    if (req.file) {
      try {
        // Read the file into a buffer
        const imageBuffer = await fs.readFile(req.file.path);

        // Add image data to tournament data
        tournamentData.image = {
          data: imageBuffer,
          contentType: req.file.mimetype,
        };

        // Store the URL and path
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        tournamentData.imageUrl = `${baseUrl}/${req.file.path}`;
        tournamentData.imagePath = req.file.path;

        console.log("Image processed successfully");
      } catch (error) {
        console.error("Error processing image:", error);
        throw new Error("Failed to process image");
      }
    }

    // Create and save tournament
    const tournament = new Tournament(tournamentData);
    await tournament.save();

    // Send successful response
    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: {
        ...tournament.toObject(),
        image: tournament.imageUrl, // Send URL instead of binary data in response
      },
    });
  } catch (error) {
    console.error("Tournament creation error:", error);

    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }

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
