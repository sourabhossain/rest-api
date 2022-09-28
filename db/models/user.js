const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {}
	}

	User.init(
		{
			name: DataTypes.STRING,
			username: DataTypes.STRING,
			gender: DataTypes.STRING,
			email: DataTypes.STRING,
			address: DataTypes.TEXT,
			uuid: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "User",
			paranoid: true,
		}
	);
	User.getUserById = (id, include = null, scope = null) => {
		return scope
			? User.scope(scope).findByPk(id, { include })
			: User.findByPk(id, { include });
	};
	User.getUser = (query, scope = null) => {
		return scope ? User.scope(scope).findOne(query) : User.findOne(query);
	};
	User.getUsers = (query) => {
		query = removeDuplicateEntryCount(query);
		return User.findAndCountAll(query);
	};
	User.createUser = (data, transaction = null) => {
		const model = {};

		if (data.name) model.name = data.name.trim();
		if (data.username) model.username = data.username.trim();
		if (data.gender) model.gender = data.gender.trim();
		if (data.email) model.email = data.email.trim();
		if (data.address) model.address = data.address.trim();
		if (data.uuid) model.uuid = data.uuid.trim();

		return User.create(model, transaction);
	};

	User.updateUser = (model, data) => {
		if (data.name) model.name = data.name.trim();
		if (data.username) model.username = data.username.trim();
		if (data.gender) model.gender = data.gender.trim();
		if (data.email) model.email = data.email.trim();
		if (data.address) model.address = data.address.trim();
		if (data.uuid) model.uuid = data.uuid.trim();

		return model.save();
	};

	User.deleteUser = (where) => {
		return User.destroy({ where });
	};

	User.upsertUser = (data, transaction = null) => {
		return User.upsert(data, transaction);
	};

	return User;
};
