const mongoose = require("mongoose");
 
// Connects to MongoDB Atlas using the URI in the .env file.
// Called once when the server starts (see server.js).
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process if the DB connection fails - the API is useless without it
    process.exit(1);
  }
};
 
module.exports = connectDB;