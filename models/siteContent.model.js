import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SiteContent = sequelize.define(
    "SiteContent",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      phone_number: DataTypes.STRING,
      support_email: DataTypes.STRING,
      address: DataTypes.STRING,
      admission_period: DataTypes.STRING,
      stat_years_experience: DataTypes.STRING,
      stat_students_info: DataTypes.STRING,
      stat_awards_info: DataTypes.STRING,
      footer_description: DataTypes.TEXT,
      about_section_quote: DataTypes.TEXT,
    },
    { tableName: "site_content", timestamps: false }
  );

  return SiteContent;
};
