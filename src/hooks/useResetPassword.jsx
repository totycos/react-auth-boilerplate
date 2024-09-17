import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials) =>
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
