// middlewares/comment.validation.js

export const validateCommentCreate = (req, res, next) => {
  const { article_id, author_name, content } = req.body;

  // Check article
  if (!article_id || isNaN(article_id)) {
    return res.status(400).json({ message: "article_id không hợp lệ" });
  }

  // Author
  if (!author_name || author_name.trim().length === 0) {
    return res.status(400).json({ message: "Tên tác giả không được để trống" });
  }

  if (author_name.length < 2) {
    return res.status(400).json({ message: "Tên tác giả phải từ 2 ký tự trở lên" });
  }

  // Content
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
  }

  if (content.length < 5) {
    return res.status(400).json({ message: "Nội dung bình luận phải từ 5 ký tự trở lên" });
  }

  next();
};


export const validateCommentUpdate = (req, res, next) => {
  const { author_name, content } = req.body;

  // Author nếu có
  if (author_name) {
    if (author_name.trim().length === 0) {
      return res.status(400).json({ message: "Tên tác giả không hợp lệ" });
    }
    if (author_name.length < 2) {
      return res.status(400).json({ message: "Tên tác giả phải từ 2 ký tự trở lên" });
    }
  }

  // Content nếu có
  if (content) {
    if (content.trim().length === 0) {
      return res.status(400).json({ message: "Nội dung bình luận không hợp lệ" });
    }
    if (content.length < 5) {
      return res.status(400).json({ message: "Nội dung bình luận phải từ 5 ký tự trở lên" });
    }
  }

  next();
};
