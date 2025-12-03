export const validateAdminLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username?.trim()) {
    return res.status(400).json({ message: "Username không được để trống" });
  }

  if (!password?.trim()) {
    return res.status(400).json({ message: "Password không được để trống" });
  }

  next();
};

export const validateAdminRegister = (req, res, next) => {
  const { username, password } = req.body;

  if (!username?.trim()) {
    return res.status(400).json({ message: "Username không được để trống" });
  }

  if (username.length < 4) {
    return res.status(400).json({ message: "Username phải ≥ 4 ký tự" });
  }

  if (!password?.trim()) {
    return res.status(400).json({ message: "Password không được để trống" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password phải ≥ 6 ký tự" });
  }

  next();
};
