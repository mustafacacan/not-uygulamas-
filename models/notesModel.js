const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notes = sequelize.define(
  "Notes",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Notes;
