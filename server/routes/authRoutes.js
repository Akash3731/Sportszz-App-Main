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

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
const dir = "uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Route for uploading images
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("File uploaded successfully:", req.file.filename);
    res.json({
      imageUrl: `http://192.168.0.173:5050/api/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Serve static files from the uploads directory
router.use("/uploads", express.static("uploads"));

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

module.exports = router;
