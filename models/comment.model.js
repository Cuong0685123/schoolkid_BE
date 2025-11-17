import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      article_id: { type: DataTypes.INTEGER, allowNull: false },
      author_name: DataTypes.STRING,
      content: DataTypes.TEXT,
      created_at: DataTypes.DATE,
    },
    { tableName: "comments", timestamps: false }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.NewsArticle, { foreignKey: "article_id" });
  };

  return Comment;
};
