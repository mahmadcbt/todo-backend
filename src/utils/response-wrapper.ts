export const successResponse = <T>(data: T, message: string = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string = "Error", error?: any) => ({
  success: false,
  message,
  error,
});
