const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  car: String,
  date: String,
  time: String,
  name: String,
  phone: String
});

module.exports = mongoose.model("Booking", BookingSchema);
