const User = require("./userModel");
const Notes = require("./notesModel");

User.hasMany(Notes, { foreignKey: "userId", as: "notes" });
Notes.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  User,
  Notes,
};