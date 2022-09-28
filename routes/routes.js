const express = require("express");
const Model = require("../models/model");
const router = express.Router();
const mongooseQueryParser = require("lib-mongoose-query");
const db = require("./../db/models");

//Post Method
router.post("/users", async (req, res) => {
	// const data = new Model({
	// 	name: req.body.name,
	// 	age: req.body.age,
	// });

	// try {
	// 	const dataToSave = await data.save();
	// 	res.status(200).json(dataToSave);
	// } catch (error) {
	// 	res.status(400).json({ message: error.message });
	// }

	try {
		const data = { ...req.body, ...req.params };
		const user = await db.User.createUser(data);

		res.status(200).send({
			success: true,
			message: "user created",
			data: user,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//Get all Method
router.get("/users", async (req, res) => {
	try {
		const query = await mongooseQueryParser.parse(req);
		const data = await Model.find(query);
		res.json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//Get by ID Method
router.get("/users/:id", async (req, res) => {
	try {
		const data = await Model.findById(req.params.id);
		res.json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//Update by ID Method
router.patch("/users/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const updatedData = req.body;
		const options = { new: true };

		const result = await Model.findByIdAndUpdate(id, updatedData, options);

		res.send(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//Delete by ID Method
router.delete("/users/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const data = await Model.findByIdAndDelete(id);
		res.send(`Document with ${data.name} has been deleted..`);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;
