import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PromotionalVideo = sequelize.define(
    "PromotionalVideo",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: DataTypes.STRING,
      video_url: DataTypes.STRING,
      thumbnail_image_url: DataTypes.STRING,
    },
    { tableName: "promotional_videos", timestamps: false }
  );

  return PromotionalVideo;
};
