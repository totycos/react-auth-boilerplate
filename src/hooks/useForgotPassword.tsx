import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

type ForgotPasswordData = {
  user: {
    email: string;
  };
};

const useForgotPassword = () => {
  return useMutation({
    mutationFn: (credentials: ForgotPasswordData) =>
      axiosInstance.post("users/password", credentials),
    onSuccess: (response) => {
      return response;
    },
    onError: (error) => {
      console.error("Forgot password failed :", error);
    },
  });
};

export default useForgotPassword;
