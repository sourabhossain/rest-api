const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

module.exports = mongoose.model("Data", dataSchema);
