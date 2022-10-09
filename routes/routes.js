const express = require("express");
const Model = require("../models/model");
const router = express.Router();
const mongooseQueryParser = require("lib-mongoose-query");
const mongooseQueryTransform = require("./../mongooseQueryTransform");
const db = require("./../db/models");

//Post Method
router.post("/users", async (req, res) => {
	try {
		const userDetails = new Model(req?.body);
		const dataToSave = await userDetails.save();
		const data = {
			...req.body,
			...req.params,
			uuid: String(dataToSave._id),
		};
		const user = await db.User.createUser(data);

		res.status(200).send({
			success: true,
			message: "user created",
			data: { ...user.dataValues, userDetails: dataToSave },
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

	// try {
	// 	const data = { ...req.body, ...req.params, uuid: dataToSave._id };
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
		const noSqlModels = {
			Role: (query) => console.log(query),
		};
		const transform = await mongooseQueryTransform.transform(
			req,
			noSqlModels
		);

		console.log(
			"🚀 ~ file: routes.js ~ line 50 ~ router.get ~ transform",
			transform
		);
		// const query = await mongooseQueryParser.parse(req);
		// const data = await Model.find(query);
		// res.json(data);

		const { query } = req;
		// console.log(
		// 	"🚀 ~ file: routes.js ~ line 49 ~ router.get ~ query",
		// 	query
		// );

		// const data = await db.User.getUsers(query);

		res.status(200).send({
			success: true,
			message: "user fetched",
			data,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

const print = (name) => {
	console.log("!!--> name", name);
};

const iterativeExtraction = (json, noSqlModels) => {
	let result = {};

	Object.keys(json).forEach((key) => {
		if (json[key] && typeof json[key] === "object") {
			if (
				key === "include" &&
				noSqlModels?.hasOwnProperty(json[key]?.model)
			) {
				result = {
					...result,
					...json[key],
					modelFunction: noSqlModels[json[key]?.model],
				};
				delete json[key];
			}

			result = {
				...result,
				...iterativeExtraction(json[key] || {}, noSqlModels),
			};
		}
	});

	return result;
};

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
		const { id } = req.params;
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
