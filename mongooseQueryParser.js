"use strict";

const Promise = require("bluebird");

const operators = {
	gt: "$gt",
	gte: "$gte",
	lt: "$lt",
	lte: "$lte",
	ne: "$ne",
	eq: "$eq",
	not: "$not",
	regexp: "$regex", // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
	notRegexp: "Op.notRegexp", // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
	and: "$and", // AND (a = 5)
	or: "$or", // (a = 5 OR a = 6)
	nor: "$nor", // !(a = 5 OR a = 6)
	between: "Op.between", // BETWEEN 6 AND 10
	notBetween: "Op.notBetween", // NOT BETWEEN 11 AND 15
	in: "$in", // IN [1, 2]
	notIn: "$nin", // NOT IN [1, 2]
};

/**
 * Replaces operator (json object key) with mongoose operators.
 * @param {JSON} json
 * @param {string} key
 * @param {mongoose_operators} op
 */
const replaceKeyWithOperator = (json, key, op) => {
	const value = json[key];
	delete json[key];
	json[op] = value;
};

/**
 * Iteratively replace json keys with mongoose formatted query operators.
 * @param {JSON} json next json
 */
const iterativeReplace = (json) => {
	Object.keys(json).forEach((key) => {
		if (json[key] !== null && typeof json[key] === "object") {
			const op = operators[key];

			if (op) {
				replaceKeyWithOperator(json, key, op);
				iterativeReplace(json[op]);
			} else {
				iterativeReplace(json[key]);
			}
		} else if (key == "model" && db[json[key]] != null) {
			json.model = db[json[key]];
		} else {
			const op = operators[key];
			if (op) replaceKeyWithOperator(json, key, op);
		}
	});
};

/**
 * Unescape escaped sequences in string.
 * @param {*} query string with escape sequence
 * @returns {string} unescaped string
 */
const unescapeEscapedQuery = (query) => {
	const queryString = query.toString();
	const queryStringUnescaped = unescape(queryString);
	return queryStringUnescaped;
};

/**
 * Parse and build mongoose format query
 * @param {JSON} query
 * @returns {JSON} mongoose formatted DB query params JSON
 */
const parseQueryFields = (query) => {
	const json = JSON.parse(unescapeEscapedQuery(query));
	iterativeReplace(json);
	return json;
};

/**
 * It takes a query string and returns a mongoose query object
 * @param req - The request object from the express route.
 * @returns A promise that resolves to a mongoose query object.
 */
const parse = (req) => {
	console.debug("Request Query: ", req.query);

	return new Promise((resolve, reject) => {
		try {
			let dbQuery = {};

			for (const key in req.query) {
				switch (key) {
					// TODO: associate where next revision
					case "query":
						const parsed = parseQueryFields(req.query.query);
						dbQuery = { ...dbQuery, ...parsed };
						break;
				}
			}

			console.debug("Final mongoose query:");
			console.debug(JSON.stringify(dbQuery, null, 4));

			resolve(dbQuery);
		} catch (error) {
			console.debug("Error: ", error.message);
			reject([{ msg: error.message }]);
		}
	});
};

module.exports = {
	parse,
};
