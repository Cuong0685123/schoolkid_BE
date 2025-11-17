import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Application = sequelize.define(
    "Application",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      parent_name: DataTypes.STRING,
      parent_email: DataTypes.STRING,
      parent_phone: DataTypes.STRING,
      child_name: DataTypes.STRING,
      child_age: DataTypes.INTEGER,
      program_id: { type: DataTypes.INTEGER, allowNull: false },
      message: DataTypes.TEXT,
      submitted_at: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    { tableName: "applications", timestamps: false }
  );

  Application.associate = (models) => {
    Application.belongsTo(models.Program, { foreignKey: "program_id" });
  };

  return Application;
};
