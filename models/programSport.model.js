import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProgramSport = sequelize.define(
    "ProgramSport",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      program_id: { type: DataTypes.INTEGER, allowNull: false },
      title: DataTypes.STRING,
      detail: DataTypes.TEXT,
      thumbnail_url: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    { tableName: "program_sport", timestamps: false }
  );

  ProgramSport.associate = (models) => {
    ProgramSport.belongsTo(models.Program, { foreignKey: "program_id" });
  };

  return ProgramSport;
};
