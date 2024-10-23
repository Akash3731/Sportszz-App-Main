
/*const express = require("express");
const router = express.Router();
const managerController = require("../controllers/managerController");
const { managerAuth } = require("../middleware/authMiddleware");

router.post("/managers", managerController.addManager);
router.get("/club-admin/managers", managerController.getAllManagers);
router.put("/managers/:id/activate", managerController.activateManager);
router.delete("/managers/:id", managerController.deleteManager);
router.post("/managers/groups", managerAuth, managerController.createGroup);  // Create Group
router.get("/managers/groups", managerAuth, managerController.getGroups); 
router.get("/managers/:id", managerAuth, managerController.getManagerById);

module.exports = router;*/



const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../Modal/User");
const Superadminmodel = require("../Modal/Superadminmodel");
const { Manager, Group, Team, Player } = require("../Modal/ClubManager");
require("dotenv").config();
const router = express.Router();
const Task = require("../Modal/Task");
const Notification = require("../Modal/Notifications");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "aakash7536@gmail.com",
    pass: "tmcj fbnn lffr cspa",
  },
});

// Route to create a new manager
router.post("/managers", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if a manager with the given email already exists
    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    // If no existing manager, proceed with creating the new one
    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = new Manager({ name, email, password: hashedPassword });

    await newManager.save();

    // Update login link for development environment using Expo deep link
    const loginLink = `exp://192.168.0.147:8082/--/manager-login`;

    // Sending the email with credentials
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Use the email variable defined above
      subject: "Your Manager Login Link and Credentials",
      text: `Hello ${name},\n\nYour account has been created as a manager. You can log in using the following credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nClick the link below to log in:\n${loginLink}\n\nThank you,\nSportszz Team`, 
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Manager added and email sent with credentials!" });
  } catch (error) {
    console.error("Error adding manager or sending email:", error);
    res.status(500).json({
      error: "An error occurred while adding the manager or sending the email.",
    });
  }
});

router.get("/managers/me", async (req, res) => {
  try {
    // Get the manager ID from the request headers
    const managerId = req.headers["manager-id"]; // Expecting manager ID in headers

    // Check if managerId is provided
    if (!managerId) {
      return res.status(401).json({ message: "No manager logged in." });
    }

    // Find the manager using the provided ID
    const manager = await Manager.findById(managerId)
      .select("_id") // Only select the _id field, or add more fields if needed
      .lean(); // Convert to plain JavaScript object

    // If no manager is found, return a 404 response
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Return the manager ID in the response
    res.json({ _id: manager._id });
  } catch (error) {
    console.error("Error fetching current manager:", error);
    // Return a 500 status with error message
    res.status(500).json({
      message: "Error fetching manager ID",
      error: error.message,
    });
  }
});

// Fetching all managers
router.get("/club-admin/managers", async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json(managers);
  } catch (error) {
    console.error("Error fetching managers:", error); // Log the error
    res.status(500).json({ message: "Error fetching managers", error });
  }
});


// Activate or Deactivate Manager
router.put("/managers/:id/activate", async (req, res) => {
  const { isActive } = req.body;

  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    manager.isActive = isActive; 
    await manager.save(); 

    res.status(200).json({
      message: `Manager ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Error activating/deactivating manager:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete Manager Endpoint
router.delete("/managers/:id", async (req, res) => {
  try {
    const managerId = req.params.id;

    // Find the manager by ID and delete it
    const deletedManager = await Manager.findByIdAndDelete(managerId);

    // Check if the manager was found and deleted
    if (!deletedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Manager deleted successfully" });
  } catch (error) {
    console.error("Error deleting manager:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the manager" });
  }
});



// Group Routes
router.post("/managers/:managerId/groups", async (req, res) => {
  try {
    const { managerId } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return res.status(400).json({ message: "Invalid manager ID" });
    }

    const group = new Group({ name });
    await group.save();

    await Manager.findByIdAndUpdate(managerId, {
      $push: { groups: group },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error(`Error creating group: ${error.message}`);
    res
      .status(500)
      .json({ message: "An error occurred while creating a group." });
  }
});

// Delete Group
router.delete("/managers/:managerId/groups/:groupId", async (req, res) => {
  try {
    const { managerId, groupId } = req.params;

    console.log(
      `Received request to delete group: ${groupId} for manager: ${managerId}`
    );

    const manager = await Manager.findById(managerId);
    if (!manager) {
      console.log("Manager not found");
      return res.status(404).json({ message: "Manager not found" });
    }

    const groupIndex = manager.groups.findIndex(
      (group) => group._id.toString() === groupId
    );
    if (groupIndex === -1) {
      console.log("Group not found");
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the group using its index
    manager.groups.splice(groupIndex, 1);
    await manager.save();

    console.log("Group deleted successfully:", groupId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: error.message });
  }
});

// Edit Group Route
router.put("/managers/:managerId/groups/:groupId", async (req, res) => {
  try {
    const { managerId, groupId } = req.params;
    const { name } = req.body;

    console.log(
      `Received request to update group: ${groupId} for manager: ${managerId}, new name: ${name}`
    );

    const manager = await Manager.findById(managerId);
    if (!manager) {
      console.log("Manager not found");
      return res.status(404).json({ message: "Manager not found" });
    }

    const group = manager.groups.id(groupId);
    if (!group) {
      console.log("Group not found");
      return res.status(404).json({ message: "Group not found" });
    }

    group.name = name;
    await manager.save();

    console.log("Group updated successfully:", group);
    res.status(200).json(group);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: error.message });
  }
});

// Team Routes
// Create Team
router.post("/managers/:managerId/groups/:groupId/teams", async (req, res) => {
  try {
    const { managerId, groupId } = req.params;
    const { name } = req.body;

    console.log(
      `Received request to create team for manager: ${managerId}, group: ${groupId}, team name: ${name}`
    );

    const manager = await Manager.findById(managerId);
    if (!manager) {
      console.log("Manager not found");
      return res.status(404).json({ message: "Manager not found" });
    }

    const group = manager.groups.id(groupId);
    if (!group) {
      console.log("Group not found");
      return res.status(404).json({ message: "Group not found" });
    }

    const team = new Team({ name });
    group.teams.push(team);
    await manager.save();

    console.log("Team created successfully:", team);
    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update Team
router.put(
  "/managers/:managerId/groups/:groupId/teams/:teamId",
  async (req, res) => {
    try {
      const { managerId, groupId, teamId } = req.params;
      const { name } = req.body;

      console.log(
        `Received request to update team: ${teamId} for manager: ${managerId}, group: ${groupId}, new name: ${name}`
      );

      const manager = await Manager.findById(managerId);
      if (!manager) {
        console.log("Manager not found");
        return res.status(404).json({ message: "Manager not found" });
      }

      const group = manager.groups.id(groupId);
      if (!group) {
        console.log("Group not found");
        return res.status(404).json({ message: "Group not found" });
      }

      const team = group.teams.id(teamId);
      if (!team) {
        console.log("Team not found");
        return res.status(404).json({ message: "Team not found" });
      }

      team.name = name;
      await manager.save();

      console.log("Team updated successfully:", team);
      res.status(200).json(team);
    } catch (error) {
      console.error("Error updating team:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete Team
router.delete(
  "/managers/:managerId/groups/:groupId/teams/:teamId",
  async (req, res) => {
    try {
      const { managerId, groupId, teamId } = req.params;

      console.log(
        `Received request to delete team: ${teamId} for manager: ${managerId}, group: ${groupId}`
      );

      const manager = await Manager.findById(managerId);
      if (!manager) {
        console.log("Manager not found");
        return res.status(404).json({ message: "Manager not found" });
      }

      const group = manager.groups.id(groupId);
      if (!group) {
        console.log("Group not found");
        return res.status(404).json({ message: "Group not found" });
      }

      const teamIndex = group.teams.findIndex(
        (team) => team._id.toString() === teamId
      );
      if (teamIndex === -1) {
        console.log("Team not found");
        return res.status(404).json({ message: "Team not found" });
      }

      // Remove the team using its index
      group.teams.splice(teamIndex, 1);
      await manager.save();

      console.log("Team deleted successfully:", teamId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Player Routes
// Create Player
router.post(
  "/managers/:managerId/groups/:groupId/teams/:teamId/players",
  async (req, res) => {
    try {
      const { managerId, groupId, teamId } = req.params;
      const { name, position } = req.body;

      console.log(
        `Received request to create player for manager: ${managerId}, group: ${groupId}, team: ${teamId}, player name: ${name}`
      );

      const manager = await Manager.findById(managerId);
      if (!manager) {
        console.log("Manager not found");
        return res.status(404).json({ message: "Manager not found" });
      }

      const group = manager.groups.id(groupId);
      if (!group) {
        console.log("Group not found");
        return res.status(404).json({ message: "Group not found" });
      }

      const team = group.teams.id(teamId);
      if (!team) {
        console.log("Team not found");
        return res.status(404).json({ message: "Team not found" });
      }

      const player = new Player({ name, position });
      team.players.push(player);
      await manager.save();

      console.log("Player created successfully:", player);
      res.status(201).json(player);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Update Player
router.put(
  "/managers/:managerId/groups/:groupId/teams/:teamId/players/:playerId",
  async (req, res) => {
    try {
      const { managerId, groupId, teamId, playerId } = req.params;
      const { name, position } = req.body;

      console.log(
        `Received request to update player: ${playerId} for manager: ${managerId}, group: ${groupId}, team: ${teamId}, new name: ${name}, new position: ${position}`
      );

      const manager = await Manager.findById(managerId);
      if (!manager) {
        console.log("Manager not found");
        return res.status(404).json({ message: "Manager not found" });
      }

      const group = manager.groups.id(groupId);
      if (!group) {
        console.log("Group not found");
        return res.status(404).json({ message: "Group not found" });
      }

      const team = group.teams.id(teamId);
      if (!team) {
        console.log("Team not found");
        return res.status(404).json({ message: "Team not found" });
      }

      const player = team.players.id(playerId);
      if (!player) {
        console.log("Player not found");
        return res.status(404).json({ message: "Player not found" });
      }

      player.name = name;
      player.position = position;
      await manager.save();

      console.log("Player updated successfully:", player);
      res.status(200).json(player);
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete Player
router.delete(
  "/managers/:managerId/groups/:groupId/teams/:teamId/players/:playerId",
  async (req, res) => {
    try {
      const { managerId, groupId, teamId, playerId } = req.params;

      const manager = await Manager.findById(managerId);
      if (!manager) {
        console.log("Manager not found");
        return res.status(404).json({ message: "Manager not found" });
      }

      const group = manager.groups.id(groupId);
      if (!group) {
        console.log("Group not found");
        return res.status(404).json({ message: "Group not found" });
      }

      const team = group.teams.id(teamId);
      if (!team) {
        console.log("Team not found");
        return res.status(404).json({ message: "Team not found" });
      }

      // Instead of using player.remove(), filter out the player
      const initialPlayerCount = team.players.length; // Store initial count for logging
      team.players = team.players.filter(
        (player) => player._id.toString() !== playerId
      );

      // Check if the player was found and removed
      if (team.players.length === initialPlayerCount) {
        console.log("Player not found in the team");
        return res.status(404).json({ message: "Player not found" });
      }

      await manager.save(); // Save the manager to persist changes

      console.log("Player deleted successfully:", playerId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Fetch Groups
// Fetch Groups for a manager
router.get("/managers/:managerId/groups", async (req, res) => {
  try {
    const { managerId } = req.params;

    // Log the received managerId
    console.log(`Received request to fetch groups for manager: ${managerId}`);

    // Check if the managerId is valid
    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return res.status(400).json({ message: "Invalid manager ID" });
    }

    // Fetch the manager and check for existence
    const manager = await Manager.findById(managerId).select("groups");
    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }

    // Log the manager object for debugging
    console.log("Manager fetched:", manager);

    // Check if the manager has groups
    if (!manager.groups || manager.groups.length === 0) {
      return res.status(200).json([]); // Return an empty array if no groups found
    }

    // Respond with groups
    res.status(200).json(manager.groups);
  } catch (error) {
    console.error(`Error fetching groups: ${error.message}`);
    res.status(500).json({
      message: "An error occurred while fetching groups.",
      error: error.message,
    });
  }
});

// Fetch Teams in a Group
router.get("/managers/:managerId/groups/:groupId/teams", async (req, res) => {
  try {
    console.log(
      `Received request to fetch teams for manager: ${req.params.managerId}, group: ${req.params.groupId}`
    );

    const manager = await Manager.findById(req.params.managerId).select(
      "groups"
    );
    if (!manager) {
      console.log("Manager not found");
      return res.status(404).send("Manager not found.");
    }

    const group = manager.groups.id(req.params.groupId);
    if (!group) {
      console.log("Group not found");
      return res.status(404).send("Group not found.");
    }

    console.log("Teams fetched successfully:", group.teams);
    res.send(group.teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).send(error.message);
  }
});

// Fetch Players in a Team
router.get(
  "/managers/:managerId/groups/:groupId/teams/:teamId/players",
  async (req, res) => {
    try {
      console.log(
        `Received request to fetch players for manager: ${req.params.managerId}, group: ${req.params.groupId}, team: ${req.params.teamId}`
      );

      const manager = await Manager.findById(req.params.managerId).select(
        "groups"
      );
      if (!manager) {
        console.log("Manager not found");
        return res.status(404).send("Manager not found.");
      }

      const group = manager.groups.id(req.params.groupId);
      if (!group) {
        console.log("Group not found");
        return res.status(404).send("Group not found.");
      }

      const team = group.teams.id(req.params.teamId);
      if (!team) {
        console.log("Team not found");
        return res.status(404).send("Team not found.");
      }

      console.log("Players fetched successfully:", team.players);
      res.send(team.players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).send(error.message);
    }
  }
);

router.post('/managers/:managerId/tasks', async (req, res) => {
  const managerId = req.params.managerId;
  const { title, description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Task description is required.' });
  }

  try {
    // Create and save the task
    const newTask = new Task({ managerId, title,description });
    await newTask.save();

    res.status(201).json({ message: 'Task added successfully', task: newTask });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/managers/:managerId/notifications', async (req, res) => {
  const managerId = req.params.managerId;

  console.log('Fetching notifications for managerId:', managerId); // Debugging statement

  try {
    const notifications = await Notification.find({ managerId }).sort({ time: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
