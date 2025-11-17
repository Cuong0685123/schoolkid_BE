import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProgramEdu = sequelize.define(
    "ProgramEdu",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      program_id: { type: DataTypes.INTEGER, allowNull: false },
      title: DataTypes.STRING,
      detail: DataTypes.TEXT,
      thumbnail_url: DataTypes.STRING,
      age_group: DataTypes.STRING,
      duration_days: DataTypes.STRING,
      duration_hours: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    { tableName: "program_edu", timestamps: false }
  );

  ProgramEdu.associate = (models) => {
    ProgramEdu.belongsTo(models.Program, { foreignKey: "program_id" });
  };

  return ProgramEdu;
};
