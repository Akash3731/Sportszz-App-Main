const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const updateRoutes = require("./routes/updateRoutes");
const tournamentRoutes = require('./routes/tournamentRoutes');
const managerRoute = require('./routes/managerRoute');
require("dotenv").config();

const app = express();
const path = require('path');
app.use(express.json());
app.use(cors({origin: '*',}));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api", authRoutes);
app.use("/api", protectedRoutes);
app.use('/api', updateRoutes);
app.use('/api', tournamentRoutes);
app.use('/api', managerRoute);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));