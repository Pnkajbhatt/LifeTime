require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const moment = require("moment");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.post("/DOB", (req, res) => {
  const { DOB } = req.body;

  // Check if DOB is provided
  if (!DOB) {
    return res.status(400).json({
      error: "DOB is required in request body",
    });
  }
  const inputDateString = new Date(DOB);

  try {
    const endDate = moment().local();

    const startDate = moment(inputDateString);
    const totalDays = endDate.diff(startDate, "days");
    const years = endDate.diff(startDate, "years");

    const tempDate = moment(startDate).add(years, "years");
    const months = endDate.diff(tempDate, "months");
    tempDate.add(months, "months");
    const days = endDate.diff(tempDate, "days");
    res.json({
      status: "success",
      inputDate: inputDateString,
      todayDate: endDate.toISOString(),
      // Structured difference
      fullDifference: {
        years: years,
        months: months,
        days: days,
      },
      // Total difference for reference
      totalDaysDifference: totalDays,
    });
  } catch (error) {
    console.error("Date parsing error:", error);
    res.status(500).json({ error: "Invalid date format provided." });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
