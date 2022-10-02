const express = require("express");
const Model = require("../models/model");
const router = express.Router();
const mongooseQueryParser = require("lib-mongoose-query");
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
		// const query = await mongooseQueryParser.parse(req);
		// const data = await Model.find(query);
		// res.json(data);
		const json = {
			include: [
				{
					model: "User",
					as: "user",
				},
				{
					model: "BookingHealthcarePerson",
					as: "bookingHealthcarePerson",
					include: {
						model: "Employee",
						as: "employee",
						attributes: [
							"profile_picture",
							"name",
							"name_furigana",
							"mobile_no",
							"email",
							"id",
						],
						include: {
							model: "AdditionalInfo",
							as: "AdditionalInfo",
						},
					},
					attributes: [
						"employeeId",
						"type",
						"bookingId",
						"startTime",
						"endTime",
					],
				},
				{
					model: "Treatment",
					as: "treatment",
					attributes: ["name"],
				},
				{
					model: "Problem",
					as: "problem",
					attributes: ["name"],
				},
				{
					model: "BookingTreatment",
					as: "bookingTreatment",
				},
			],
		};

		const parentHashTable = {
			AdditionalInfo: "Employee",
		};

		const hashTable = {
			AdditionalInfo: (name) => print(name),
		};

		const test = iterativeExtraction(
			json,
			// { ...parentHashTable },
			hashTable
		);
		console.log(
			"🚀 ~ file: routes.js ~ line 99 ~ router.get ~ noSQLpart",
			test
		);

		// console.log(
		// 	"🚀 ~ file: routes.js ~ line 76 ~ iterativeExtraction ~ json",
		// 	JSON.stringify(json, null, 4)
		// );

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

const iterativeExtraction = (json, hashTable) => {
	const keys = Object.keys(json);

	for (const key of keys) {
		if (json[key] && typeof json[key] === "object") {
			if (
				key === "include" &&
				hashTable.hasOwnProperty(json[key]?.model)
			) {
				const noSQLpart = json[key];
				console.log(
					"🚀 ~ file: routes.js ~ line 152 ~ iterativeExtraction ~ noSQLpart",
					noSQLpart
				);
				delete json[key];
				return noSQLpart;
			}

			return iterativeExtraction(json[key] || {}, hashTable);
		}
	}

	// Object.keys(json).forEach((key) => {
	// 	if (json[key] && typeof json[key] === "object") {
	// 		if (
	// 			key === "include" &&
	// 			hashTable.hasOwnProperty(json[key]?.model)
	// 		) {
	// 			const noSql = json[key];
	// 			delete json[key];
	// 			return noSql;
	// 		}

	// 		return iterativeExtraction(json[key] || {}, hashTable);
	// 	}
	// });
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
