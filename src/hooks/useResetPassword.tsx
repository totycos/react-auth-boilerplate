import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

type ResetPasswordData = {
  user: {
    reset_password_token: string;
    password: string;
    password_confirmation: string;
  };
};

const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: ResetPasswordData) =>
      axiosInstance.patch("users/password", credentials),
    onSuccess: () => {
      navigate(`/`);
    },
    onError: (error) => {
      console.error("Reset password failed :", error);
    },
  });
};

export default useResetPassword;
