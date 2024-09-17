import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

const useForgotPassword = () => {
  return useMutation({
    mutationFn: (credentials) =>
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
