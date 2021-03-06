const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// our data base's data structure 
const DataSchema = new Schema(
  {
    //id: Number,
    url: String,
    shortUrl: String,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);