export const success = (data, message = "Success") => ({
  status: "success",
  message,
  data,
});

export const error = (message = "Error", code = 400) => ({
  status: "error",
  message,
  code,
});


export const successResponse = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = "Error", status = 500, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};
