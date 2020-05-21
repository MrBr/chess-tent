const mongoose = require("mongoose");

// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = process.env.DB_NAME;

mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Open");
});

export {};
