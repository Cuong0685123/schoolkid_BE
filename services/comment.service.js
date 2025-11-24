import { models } from "../models/index.js";

export const commentService = {
  // CREATE
  create: async (data) => {
    const { article_id } = data;

    // Kiểm tra bài viết có tồn tại không
    const article = await models.NewsArticle.findByPk(article_id);
    if (!article) throw new Error("Article not found");

    return await models.Comment.create({
      ...data,
      created_at: new Date()
    });
  },

  // GET ALL
  getAll: async () => {
    return await models.Comment.findAll({
      include: [{ model: models.NewsArticle }]
    });
  },

  // GET BY ID
  getById: async (id) => {
    return await models.Comment.findByPk(id, {
      include: [{ model: models.NewsArticle }]
    });
  },

  // UPDATE
  update: async (id, data) => {
    const comment = await models.Comment.findByPk(id);
    if (!comment) throw new Error("Comment not found");

    await comment.update(data);

    return comment;
  },

  // DELETE
  delete: async (id) => {
    const comment = await models.Comment.findByPk(id);
    if (!comment) throw new Error("Comment not found");

    await comment.destroy();
    return true;
  }
};
