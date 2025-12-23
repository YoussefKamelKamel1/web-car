const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const bookingRoutes = require("./routes/bookings");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/testdrive")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api", bookingRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
