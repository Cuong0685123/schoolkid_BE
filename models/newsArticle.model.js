import { DataTypes } from "sequelize";

export default (sequelize) => {
  const NewsArticle = sequelize.define(
    "NewsArticle",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      thumbnail_url: DataTypes.STRING,
      content: DataTypes.TEXT,
      author_name: DataTypes.STRING,
      published_at: DataTypes.DATE,
    },
    { tableName: "news_articles", timestamps: false }
  );

  // ❌ Không gọi hasMany ở đây, chỉ khai báo function
  NewsArticle.associate = (models) => {
    if (models.Comment) {
      NewsArticle.hasMany(models.Comment, { foreignKey: "article_id" });
    }
  };

  return NewsArticle;
};
