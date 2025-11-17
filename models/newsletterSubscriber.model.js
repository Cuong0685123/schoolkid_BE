import { DataTypes } from "sequelize";

export default (sequelize) => {
  const NewsletterSubscriber = sequelize.define(
    "NewsletterSubscriber",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, unique: true },
      subscribed_at: DataTypes.DATE,
    },
    { tableName: "newsletter_subscribers", timestamps: false }
  );

  return NewsletterSubscriber;
};
