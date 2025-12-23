import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TestDriveModal = ({ onClose }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [message, setMessage] = useState("");

  const isValidPhone = (phone) => {
    return /^[0-9]{8,15}$/.test(phone);
  };

  const isWeekend = (d) => {
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  const isOfficeClosed = (t) => {
    const hour = parseInt(t.split(":")[0]);
    return hour < 9 || hour > 17;
  };

  const handleConfirm = async () => {   // <-- only change: async
    setMessage("");

    if (!car || !name || !phone) {
      setMessage("❌ Please fill all fields.");
      return;
    }

    if (name.length < 3) {
      setMessage("❌ Name must be at least 3 characters.");
      return;
    }

    if (!isValidPhone(phone)) {
      setMessage("❌ Phone number must be numeric (8–15 digits).");
      return;
    }

    if (date < new Date()) {
      setMessage("❌ You cannot book in the past.");
      return;
    }

    if (isWeekend(date)) {
      setMessage("❌ Test drives are not available on weekends.");
      return;
    }

    if (isOfficeClosed(time)) {
      setMessage("❌ Test drives only available from 09:00 to 17:00.");
      return;
    }

    /* ============================
       🔗 BACKEND CONNECTION ADDED
    ============================= */
    try {
      const response = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car,
          date: date.toDateString(),
          time,
          name,
          phone
        })
      });

      const data = await response.json();

      if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage("✅ Booking saved successfully!");
      }

    } catch (err) {
      setMessage("❌ Server not reachable");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-lg relative">

        <button onClick={onClose} className="absolute top-3 right-3 text-xl">✖</button>

        <h2 className="text-2xl font-bold mb-4">Schedule Test Drive</h2>

        <label className="block mb-2 font-medium">Select Car</label>
        <select value={car} onChange={(e) => setCar(e.target.value)} className="w-full p-3 border rounded mb-4">
          <option value="">Choose a car</option>
          <option>Mercedes AMG GT</option>
          <option>BMW M4</option>
          <option>Audi RS7</option>
          <option>Tesla Model S</option>
        </select>

        <label className="block mb-2 font-medium">Select Date</label>
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          minDate={new Date()}
          className="w-full p-3 border rounded mb-4"
        />

        <label className="block mb-2 font-medium">Select Time</label>
        <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 border rounded mb-4">
          <option>09:00</option>
          <option>10:00</option>
          <option>11:00</option>
          <option>12:00</option>
          <option>13:00</option>
          <option>14:00</option>
          <option>15:00</option>
          <option>16:00</option>
          <option>17:00</option>
        </select>

        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 border rounded mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {message && (
          <div className={`p-3 rounded mb-4 text-sm ${message.includes("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <button
          onClick={handleConfirm}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          Confirm Booking
        </button>

      </div>
    </div>
  );
};

export default TestDriveModal;
