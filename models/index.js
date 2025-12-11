import { sequelize } from "../config/database.js";

// Import tất cả model factories
import AdminFactory from "./admin.model.js";
import ProgramFactory from "./program.model.js";
import ProgramEduFactory from "./programEdu.model.js";
import ProgramSportFactory from "./programSport.model.js";
import ProgramTeacherFactory from "./programTeacher.model.js";
import NewsArticleFactory from "./newsArticle.model.js";
import CommentFactory from "./comment.model.js";
import PromotionalVideoFactory from "./promotionalVideo.model.js";
import NewsletterSubscriberFactory from "./newsletterSubscriber.model.js";
import ApplicationFactory from "./application.model.js";
import SiteContentFactory from "./siteContent.model.js";

const models = {};

// 🔥 Load model
models.Admin = AdminFactory(sequelize);
models.Program = ProgramFactory(sequelize);
models.ProgramEdu = ProgramEduFactory(sequelize);
models.ProgramSport = ProgramSportFactory(sequelize);
models.ProgramTeacher = ProgramTeacherFactory(sequelize);
models.NewsArticle = NewsArticleFactory(sequelize);
models.Comment = CommentFactory(sequelize);
models.PromotionalVideo = PromotionalVideoFactory(sequelize);
models.NewsletterSubscriber = NewsletterSubscriberFactory(sequelize);
models.Application = ApplicationFactory(sequelize);
models.SiteContent = SiteContentFactory(sequelize);

// 🔥 Gọi associate SAU KHI tất cả models đã load
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

// 🔥 Sync database → tự tạo bảng khi start
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected ✔");

    await sequelize.sync();
    console.log("✔ All tables synced (auto-create / auto-update)");
  } catch (err) {
    console.error("❌ Database error:", err);
  }
};

export { models, sequelize };
