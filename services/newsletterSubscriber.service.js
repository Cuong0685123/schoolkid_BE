import { models } from "../models/index.js";

export const newsletterSubscriberService = {
  create: async ({ email }) => {
    if (!email) throw new Error("Email is required");

    // kiểm tra tồn tại
    const exists = await models.NewsletterSubscriber.findOne({ where: { email } });
    if (exists) throw new Error("Email already subscribed");

    const rec = await models.NewsletterSubscriber.create({
      email,
      subscribed_at: new Date(),
    });

    return rec;
  },

  getAll: async () => {
    return await models.NewsletterSubscriber.findAll({
      order: [["id", "DESC"]],
    });
  },

  getById: async (id) => {
    return await models.NewsletterSubscriber.findByPk(id);
  },

  update: async (id, { email }) => {
    const rec = await models.NewsletterSubscriber.findByPk(id);
    if (!rec) throw new Error("Subscriber not found");

    if (email && email !== rec.email) {
      // kiểm tra email mới có trùng không
      const exists = await models.NewsletterSubscriber.findOne({ where: { email } });
      if (exists) throw new Error("Email already subscribed");
      rec.email = email;
    }

    await rec.save();
    return rec;
  },

  remove: async (id) => {
    const rec = await models.NewsletterSubscriber.findByPk(id);
    if (!rec) throw new Error("Subscriber not found");

    await rec.destroy();
    return true;
  },
};
