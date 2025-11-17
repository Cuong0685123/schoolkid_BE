import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProgramTeacher = sequelize.define(
    "ProgramTeacher",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      program_id: { type: DataTypes.INTEGER, allowNull: false },
      full_name: DataTypes.STRING,
      profile_image_url: DataTypes.STRING,
      role: DataTypes.STRING,
      bio: DataTypes.TEXT,
    },
    { tableName: "program_teacher", timestamps: false }
  );

  ProgramTeacher.associate = (models) => {
    ProgramTeacher.belongsTo(models.Program, { foreignKey: "program_id" });
  };

  return ProgramTeacher;
};
