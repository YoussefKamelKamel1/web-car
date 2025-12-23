const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

router.post("/book", async (req, res) => {
  const { car, date, time, name, phone } = req.body;

  if (!car || !date || !time || !name || !phone) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const exists = await Booking.findOne({ car, date, time });
  if (exists) {
    return res.status(400).json({ error: "Already booked" });
  }

  const booking = new Booking({ car, date, time, name, phone });
  await booking.save();

  res.json({ success: true });
});

module.exports = router;
