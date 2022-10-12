const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{},
	{
		strict: false,
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
