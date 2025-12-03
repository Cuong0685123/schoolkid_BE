// middlewares/application.validation.js

export const validateApplicationCreate = (req, res, next) => {
  const {
    parent_name,
    parent_email,
    parent_phone,
    child_name,
    child_age,
    program_id,
  } = req.body;

  // Kiểm tra required
  if (!parent_name || !parent_email || !parent_phone)
    return res.status(400).json({ message: "Thiếu thông tin phụ huynh" });

  if (!child_name || !child_age)
    return res.status(400).json({ message: "Thiếu thông tin học sinh" });

  if (!program_id)
    return res.status(400).json({ message: "Thiếu program_id" });

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(parent_email))
    return res.status(400).json({ message: "Email không hợp lệ" });

  // Phone format (VN)
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (!phoneRegex.test(parent_phone))
    return res.status(400).json({ message: "Số điện thoại không hợp lệ" });

  // Age check
  if (isNaN(child_age) || child_age < 1 || child_age > 18)
    return res.status(400).json({ message: "Độ tuổi học sinh không hợp lệ" });

  next();
};


export const validateApplicationUpdate = (req, res, next) => {
  const {
    parent_email,
    parent_phone,
    child_age
  } = req.body;

  // Email nếu có
  if (parent_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parent_email))
      return res.status(400).json({ message: "Email không hợp lệ" });
  }

  // Phone nếu có
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (parent_phone && !phoneRegex.test(parent_phone))
    return res.status(400).json({ message: "Số điện thoại không hợp lệ" });

  // Age nếu có
  if (child_age && (isNaN(child_age) || child_age < 1 || child_age > 18))
    return res.status(400).json({ message: "Độ tuổi học sinh không hợp lệ" });

  next();
};
