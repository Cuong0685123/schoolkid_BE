import { models } from "../models/index.js";

export const newsArticleService = {
  // CREATE
  create: async (data) => {
    return await models.NewsArticle.create(data);
  },

  // GET ALL
  getAll: async () => {
    return await models.NewsArticle.findAll({
      include: [{ model: models.Comment }]
    });
  },

  // GET BY ID
  getById: async (id) => {
    return await models.NewsArticle.findByPk(id, {
      include: [{ model: models.Comment }]
    });
  },

  // UPDATE
  update: async (id, data) => {
    const article = await models.NewsArticle.findByPk(id);
    if (!article) throw new Error("Article not found");

    await article.update(data);
    return article;
  },

  // DELETE
  delete: async (id) => {
    const article = await models.NewsArticle.findByPk(id);
    if (!article) throw new Error("Article not found");

    await article.destroy();
    return true;
  }
};
