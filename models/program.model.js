import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Program = sequelize.define(
    "Program",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.ENUM("edu", "sport", "teacher"),
    },
    { tableName: "programs", timestamps: false }
  );

  Program.associate = (models) => {
    Program.hasMany(models.ProgramEdu, { foreignKey: "program_id" });
    Program.hasMany(models.ProgramSport, { foreignKey: "program_id" });
    Program.hasMany(models.ProgramTeacher, { foreignKey: "program_id" });
  };

  return Program;
};
