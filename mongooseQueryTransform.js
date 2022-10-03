"use strict";

const Promise = require("bluebird");

/**
 * Iteratively replace json keys with mongoose formatted query operators.
 * @param {JSON} json next json
 */
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
 * @param {JSON} noSqlModels
 * @returns {JSON} mongoose formatted DB include params JSON
 */
const parseIncludeFields = (query, noSqlModels) => {
	const json = JSON.parse(unescapeEscapedQuery(query));
	iterativeExtraction(json, noSqlModels);
	return json;
};

/**
 * It takes a query string and returns a mongoose query object
 * @param req - The request object from the express route.
 * @returns A promise that resolves to a mongoose query object.
 */
const transform = (req, noSqlModels) => {
	console.debug("Request Query: ", req.query);

	return new Promise((resolve, reject) => {
		try {
			let dbQuery = {};

			for (const key in req.query) {
				switch (key) {
					case "include":
						dbQuery = parseIncludeFields(
							req.query.include,
							noSqlModels
						);
						break;
				}
			}

			console.debug("Final mongoose transform query:");
			console.debug(JSON.stringify(dbQuery, null, 4));

			resolve(dbQuery);
		} catch (error) {
			console.debug("Error: ", error.message);
			reject([{ msg: error.message }]);
		}
	});
};

module.exports = {
	transform,
};
