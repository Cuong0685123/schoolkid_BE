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
