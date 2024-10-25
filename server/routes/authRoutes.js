/*const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Modal/User");
const {Manager} = require("../Modal/ClubManager");
const Superadminmodel = require('../Modal/Superadminmodel');
require("dotenv").config();
const router = express.Router();

// Register a new user (this remains unchanged)
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, role, age, website, members } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      mobile,
      password,
      role,
      age,
      website,
      members,
      isApproved: role === 'Club' || role === 'Organization' ? false : true,
    });

    await user.save();

    if (user.isApproved) {
      const payload = { userId: user.id };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token, message: "Registration successful" });
      });
    } else {
      res.json({ message: "Registration successful, waiting for approval" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Login as User or Manager
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check if the user exists
    let user = await User.findOne({ email });

    if (user) {
      if (!user.isApproved) {
        return res.status(403).json({ message: "User not approved yet" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    // If not found as a user, check if it's a manager login
    /*let manager = await Manager.findOne({ email });
    if (manager) {
      const isPasswordValid = await bcrypt.compare(password, manager.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid manager credentials" });
      }

      if (!manager.isActive) {
        return res.status(403).json({ message: "Manager is not active" });
      }  

      const token = jwt.sign({ id: manager._id, role: 'Manager' }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({
        token,
        user: {
          id: manager._id,
          email: manager.email,
          name: manager.name,
          role: 'Manager',
        },
      });
    }

    // If no user or manager is found
    return res.status(400).json({ message: "Invalid credentials" });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});


try {
  const manager = await Manager.findOne({ email });
  if (!manager) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, manager.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!manager.isActive) {
    return res.status(403).json({ message: "Manager is not active" });
  }

  const token = jwt.sign({ id: manager._id, role: "Manager" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({
    token,
    user: {
      id: manager._id,
      email: manager.email,
      name: manager.name,
      role: "Manager",
    },
  });
} catch (error) {
  console.error("Error logging in:", error);
  res.status(500).json({ message: "Error logging in", error });
}
}});

// Superadmin login
router.post('/superadminlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Superadminmodel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;*/

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Modal/User");
const { Manager } = require("../Modal/ClubManager");
const Superadminmodel = require("../Modal/Superadminmodel");
require("dotenv").config();
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Importing models
const Player = require("../Modal/Player");
const Team = require("../Modal/Team");
const Group = require("../Modal/Group");
const Tournament = require("../Modal/Tournament");
const config = require("../../client/components/config.cjs");
const mongoose = require("mongoose");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// Update storage configuration to use absolute paths
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// Create the upload middleware using the storage configuration
const upload = multer({ storage: storage }); // Use the 'storage' defined above

// Register a new user (this remains unchanged)
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, role, age, website, members } =
    req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      mobile,
      password,
      role,
      age,
      website,
      members,
      isApproved: role === "Club" || role === "Organization" ? false : true,
    });

    await user.save();

    if (user.isApproved) {
      const payload = { userId: user.id };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, message: "Registration successful" });
        }
      );
    } else {
      res.json({ message: "Registration successful, waiting for approval" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Login as User or Manager
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check if the user exists
    let user = await User.findOne({ email });

    if (user) {
      if (!user.isApproved) {
        return res.status(403).json({ message: "User not approved yet" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    // If not found as a user, check if it's a manager login
    let manager = await Manager.findOne({ email });
    if (manager) {
      const isPasswordValid = await bcrypt.compare(password, manager.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid manager credentials" });
      }

      if (!manager.isActive) {
        return res.status(403).json({ message: "Manager is not active" });
      }

      const token = jwt.sign(
        { id: manager._id, role: "Manager" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({
        token,
        user: {
          id: manager._id,
          email: manager.email,
          name: manager.name,
          role: "Manager",
        },
      });
    }

    // If no user or manager is found
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Superadmin login
router.post("/superadminlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Superadminmodel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint to fetch manager ID
// Endpoint to fetch manager ID
router.get("/managerId", async (req, res) => {
  try {
    // Fetch the manager, customize the query as needed
    const manager = await Manager.findOne(); // Update to filter based on criteria if necessary

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    res.status(200).json({
      success: true,
      managerId: manager._id, // Assuming _id is your managerId
    });
  } catch (error) {
    console.error("Error fetching manager ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching manager ID",
      error: error.message,
    });
  }
});

{
  /* Team Management */
}

// Serve uploaded files
// Serve files from the 'uploads' directory
router.use("/uploads", express.static(uploadDir));

//Create a group
router.post("/add-groups", upload.single("image"), async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { name, tournamentId } = req.body;

  if (!name || !tournamentId) {
    return res.status(400).json({
      success: false,
      message: "Group name and tournament ID are required.",
    });
  }

  try {
    const tournament = await Tournament.findById(tournamentId).lean();
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found.",
      });
    }

    // Normalize the name for comparison
    const normalizedNewName = name.trim().toLowerCase();

    // Check for duplicates
    const isDuplicate = tournament.groups.some(
      (group) => (group.groupname || "").toLowerCase() === normalizedNewName
    );

    if (isDuplicate) {
      // If a file was uploaded, clean it up since we won't be using it
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error removing uploaded file:", unlinkError);
        }
      }

      return res.status(400).json({
        success: false,
        message: "A group with this name already exists in the tournament.",
      });
    }

    // Process image
    let imageUrl = null;
    if (req.file) {
      const filename = req.file.filename;
      imageUrl = `${config.backendUrl}/uploads/${filename}`;
    }

    // Create new group with MongoDB ObjectId
    const newGroup = {
      groupname: name.trim(),
      tournamentId,
      image: imageUrl,
      teams: [],
      _id: new mongoose.Types.ObjectId(),
    };

    // Update tournament with new group
    await Tournament.findByIdAndUpdate(
      tournamentId,
      { $push: { groups: newGroup } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Group added successfully!",
      group: {
        groupname: newGroup.groupname,
        _id: newGroup._id,
        image: newGroup.image,
        teams: newGroup.teams,
      },
    });
  } catch (error) {
    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error removing uploaded file:", unlinkError);
      }
    }

    console.error("Error adding group:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// Modify the fetch groups route to ensure consistent field names
// Route for fetching groups
router.get("/tournaments/:tournamentId/groups", async (req, res) => {
  const { tournamentId } = req.params;

  try {
    // Validate tournamentId
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tournament ID.",
      });
    }

    // Find the tournament
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found.",
      });
    }

    return res.status(200).json({
      success: true,
      groups: tournament.groups, // Return the groups array
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch groups.",
    });
  }
});

// Route for deleting a group
// Route for deleting a group
router.delete(
  "/tournaments/:tournamentId/groups/:groupId",
  async (req, res) => {
    const { tournamentId, groupId } = req.params;

    try {
      // Validate tournamentId
      if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tournament ID.",
        });
      }

      // Validate groupId
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid group ID.",
        });
      }

      // Find the tournament by ID
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: "Tournament not found.",
        });
      }

      // Check if the group exists in the tournament
      const groupExists = tournament.groups.some(
        (group) => group._id.toString() === groupId
      );
      if (!groupExists) {
        return res.status(404).json({
          success: false,
          message: "Group not found.",
        });
      }

      // Remove the group from the tournament's groups
      tournament.groups = tournament.groups.filter(
        (group) => group._id.toString() !== groupId
      );

      // Save the updated tournament document
      await tournament.save();

      return res.status(200).json({
        success: true,
        message: "Group deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      return res.status(500).json({
        success: false,
        message: "Could not delete group.",
      });
    }
  }
);

module.exports = router;
