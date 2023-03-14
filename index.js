require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const DB = process.env.DATABASE_URL;

mongoose.set("strictQuery", false);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.debug("Successfully connected ");
	})
	.catch((error) => {
		console.debug(`can not connect to database, ${error}`);
	});

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
	console.debug(`Server Started at ${3000}`);
});
