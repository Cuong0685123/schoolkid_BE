import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ROUTES
import promotionalVideoRoutes from "./routes/promotionalVideo.routes.js";
import newsletterRoutes from "./routes/newsletterSubscriber.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import newsArticleRoutes from "./routes/newsArticle.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import programRoutes from "./routes/program.routes.js";
import siteContentRoutes from "./routes/siteContent.routes.js";
import oauthRoutes from "./routes/oauth2.routes.js";
import index from "./routes/index.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTES
app.use("/",index);
//app.use("/", oauthRoutes);
app.use("/api/promotional-video", promotionalVideoRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/news-articles", newsArticleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/applications", applicationRoutes);
export default app;
