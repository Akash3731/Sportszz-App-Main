const express = require("express");
const {
  createTournament,
  upload,
  getTournamentHistory,
  getTournamentById,
  deleteTournament,
  updateTournament,
  updateCourt,
  updateTime,
  autoSaveTournamentInput,
  shuffleTeams,
} = require("../controllers/tournamentController");
const router = express.Router();

// Route to create a new tournament
router.post("/tournaments", upload.single("image"), (req, res) =>
  createTournament(req, res, req.body.managerId)
);

//Route to get tournament history
router.get("/get-tournament-history", getTournamentHistory);

// Route to get a tournament by ID
router.get("/tournaments/:id", getTournamentById); // Fetch tournament by ID

// // Route to get all tournaments
// router.get("/tournaments", getTournaments);

// // Route to get a specific tournament by ID
// router.get("/tournaments/:id", getTournamentById);

// // Route to update a specific tournament by ID
// router.put("/tournaments/:id", upload.single("image"), updateTournament);

// // Route to delete a specific tournament by ID
// router.delete("/tournaments/:id", deleteTournament);

// // Route to auto-save tournament input (e.g., for live updates)
// router.put("/tournaments/autosave", autoSaveTournamentInput);

// // Route to shuffle teams in a tournament
// router.post("/tournaments/:id/shuffle", shuffleTeams);

// // Route to update the court for a specific tournament
// router.put("/tournaments/:id/updateCourt", updateCourt);

// // Route to update the time of day for a specific tournament
// router.put("/tournaments/:id/updateTime", updateTime);

module.exports = router;
