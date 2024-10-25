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
// Importing models
const Player = require("../Modal/Player");
const Team = require("../Modal/Team");
const Group = require("../Modal/Group");
const Tournament = require("../Modal/Tournament");

// Set up Multer for file uploads with defined storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the original file extension
    cb(null, Date.now() + ext); // Set the file name with the extension
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

router.post("/upload", upload.single("image"), async (req, res) => {
  // Check if file is uploaded
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const { name, tournamentId } = req.body;

  // Validate required fields
  if (!name || !tournamentId) {
    return res.status(400).json({
      success: false,
      message: "Group name and tournament ID are required.",
    });
  }

  try {
    const imageUrl = req.file.path.replace(/\\/g, "/");
    console.log("Image saved at:", imageUrl); // Log the file path

    // Create a new Group document
    const group = new Group({
      name,
      tournamentId,
      image: `http://192.168.1.15:5050/api/uploads/${path.basename(imageUrl)}`,
    });

    await group.save(); // Save the group document

    res.status(200).json({
      success: true,
      group: {
        ...group._doc,
        image: `http://192.168.1.15:5050/api/uploads/${path.basename(
          imageUrl
        )}`,
      },
    });
  } catch (error) {
    console.error("Error processing image upload:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// Serve uploaded files
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to add a group
router.post("/add-groups", upload.single("image"), async (req, res) => {
  const { name, tournamentId } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Get image path

  try {
    // Create a new group with the provided data
    const newGroup = new Group({
      name,
      tournamentId,
      image: imageUrl,
    });

    // Save the new group to the database
    await newGroup.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: "Group added successfully!",
      group: newGroup,
    });
  } catch (error) {
    console.error("Error saving group:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add group.",
      error: error.message,
    });
  }
});

module.exports = router;
