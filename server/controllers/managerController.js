const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Manager, Group } = require("../Modal/ClubManager");
const User = require("../Modal/User");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "notmumbai@gmail.com", 
    pass: "djbz wrcn uwtt woob", 
  },
});

exports.addManager = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use by a user. Choose another one." });
    }

    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = new Manager({ name, email, password: hashedPassword });
    await newManager.save();

    const loginLink = `exp://192.168.0.141:8081/--/manager-login`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Manager Login Link and Credentials",
      text: `Hello ${name},\n\nYour account has been created as a manager. You can log in using the following credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nClick the link below to log in:\n${loginLink}\n\nThank you,\nSportszz Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      }
      console.log("Email sent:", info.response);
    });

    res.status(201).json({ message: "Manager added and email sent with credentials!" });
  } catch (error) {
    console.error("Error adding manager or sending email:", error);
    res.status(500).json({ error: "An error occurred while adding the manager or sending the email." });
  }
};

exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json(managers);
  } catch (error) {
    console.error("Error fetching managers:", error);
    res.status(500).json({ message: "Error fetching managers", error });
  }
};

exports.activateManager = async (req, res) => {
  const { isActive } = req.body;
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    manager.isActive = isActive;
    await manager.save();
    res.status(200).json({ message: `Manager ${isActive ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    console.error("Error activating/deactivating manager:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.deleteManager = async (req, res) => {
  try {
    const managerId = req.params.id;
    const deletedManager = await Manager.findByIdAndDelete(managerId);
    if (!deletedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json({ message: "Manager deleted successfully" });
  } catch (error) {
    console.error("Error deleting manager:", error);
    res.status(500).json({ message: "An error occurred while deleting the manager" });
  }
};

// In managerController.js
exports.getManagerById = (req, res) => {
    const managerId = req.params.id;  // Get manager ID from the route parameter
    // Fetch the manager from the database using the managerId
    // Assuming you're using Mongoose:
    Manager.findById(managerId)
        .then(manager => {
            if (!manager) {
                return res.status(404).json({ message: "Manager not found" });
            }
            res.status(200).json({
                success: true,
                manager: manager,  // Return the manager details
            });
        })
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.createGroup = async (req, res) => {
    const managerId = req.user.id; 
    const { name } = req.body;
  
    try {
      // Validate input
      if (!name) {
        return res.status(400).json({ error: "Group name is required." });
      }
  
      // Check if manager exists and is active
      const manager = await Manager.findById(managerId);
      if (!manager || !manager.isActive) {
        return res.status(403).json({ error: "Manager is not active or does not exist." });
      }
  
      // Create the new group
      const newGroup = new Group({ name, createdBy: managerId });
      await newGroup.save();
  
      // Add the new group to the manager's groups
      manager.groups.push(newGroup._id);
      await manager.save();
  
      res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ error: "An error occurred while creating the group." });
    }
  };
  
  // Get Groups created by Manager
  exports.getGroups = async (req, res) => {
    const managerId = req.user.id;
  
    try {
      const groups = await Group.find({ createdBy: managerId });
      res.status(200).json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ error: "An error occurred while fetching the groups." });
    }
  };