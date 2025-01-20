const cron = require("node-cron");
const mongoose = require("mongoose");
const Event = require("../Schemas/EventSchema");
require("dotenv").config();

console.log("Cron job setup initialized.");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB for cron jobs");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if connection fails
  });

cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log(`Cron job triggered at ${now}`);

  try {
    // Open events
    console.log("Checking for events to open...");
    const eventsToOpen = await Event.updateMany(
      { status: "CLOSED", start_time: { $lte: now }, end_time: { $gt: now } },
      { $set: { status: "OPEN" } },
    );
    console.log(`Opened ${eventsToOpen.nModified} events`);

    // Close events
    console.log("Checking for events to delete...");
    const eventsToDelete = await Event.deleteMany({ end_time: { $lt: now } });
    console.log(`Deleted ${eventsToDelete.deletedCount} events`);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
