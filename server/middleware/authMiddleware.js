const jwt = require("jsonwebtoken");
const Manager = require("../Modal/ClubManager").Manager;

// Middleware to verify JWT token for managers
exports.managerAuth = async (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization denied. No token provided." });
  }

  // Ensure the token is properly formatted
  const token = authHeader.replace("Bearer ", "");
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const manager = await Manager.findById(decoded.id);

    if (!manager) {
      return res.status(401).json({ message: "Manager not found." });
    }

    // Store the decoded user in the request object for use in the next middleware
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
