require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
	console.log(error);
});

database.once("connected", () => {
	console.log("Database Connected");
});
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const routes = require("./routes/routes");

app.use("/api", routes);

app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use((err, req, res) => {
	res.status(err.status || 500);
	const errorResponse = {};
	errorResponse.status = err.status;
	errorResponse.message = err.message;
	res.json(errorResponse);
});

app.listen(3000, () => {
	console.log(`Server Started at ${3000}`);
});
