const redis = require("redis");

class RedisClient {
	constructor() {
		this.client = redis.createClient();

		this.client
			.connect()
			.then(async (res) => {
				console.debug("Redis client connected");
			})
			.catch((err) => {
				console.error("Redis error: ", err);
			});
	}

	set(key, value) {
		this.client.set(key, value, (err, reply) => {
			if (err) {
				console.error(err);
			} else {
				console.debug(`Set ${key}: ${value}`);
			}
		});
	}

	get(key) {
		this.client.get(key, (err, reply) => {
			if (err) {
				console.error(err);
			} else {
				console.debug(`Get ${key}: ${reply}`);
				return reply;
			}
		});
	}

	async get(key) {
		try {
			const value = await this.client.get(key);
			console.debug(`Get ${key}: ${value}`);
			return value;
		} catch (err) {
			console.error(err);
		}
	}

	del(key) {
		this.client.del(key, (err, reply) => {
			if (err) {
				console.error(err);
			} else {
				console.debug(`Deleted ${key}`);
			}
		});
	}
}

module.exports = RedisClient;
