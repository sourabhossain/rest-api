"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			username: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: true,
			},
			gender: {
				type: Sequelize.ENUM(["male", "female", "other"]),
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			address: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			uuid: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			deletedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Users");
	},
};
