const express = require("express");
const User = require("../models/user");
const router = express.Router();
const db = require("./../db/models");

//Post Method
router.post("/users", async (req, res) => {
	try {
		const data = new User({ ...req.body, ...req.params });
		const dataToSave = await data.save();

		res.status(200).json({
			success: true,
			message: "user created",
			data: dataToSave,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

	// try {
	// 	const data = { ...req.body, ...req.params };
	// 	const user = await db.User.createUser(data);
	// 	res.status(200).send({
	// 		success: true,
	// 		message: "user created",
	// 		data: user,
	// 	});
	// } catch (error) {
	// 	res.status(400).json({ message: error.message });
	// }
});

//Get all Method
router.get("/users", async (req, res) => {
	try {
		const data = await User.find(req.query);
		res.json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//Get by ID Method
router.get("/users/:id", async (req, res) => {
	try {
		const data = await User.findById(req.params.id);
		res.json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//Update by ID Method
router.patch("/users/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const updatedData = req.body;
		const options = { new: true };

		const result = await User.findByIdAndUpdate(id, updatedData, options);

		res.send(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//Delete by ID Method
router.delete("/users/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const data = await User.findByIdAndDelete(id);
		res.send(`Document with ${data.name} has been deleted.`);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;
