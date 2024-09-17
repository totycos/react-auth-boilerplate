import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";

const useLogin = () => {
  const { login } = useContext(AuthContext);

  return useMutation({
    mutationFn: (credentials) =>
      axiosInstance.post("users/sign_in", credentials),
    onSuccess: (response) => {
      const token = response.headers.authorization;
      login(token);
    },
    onError: (error) => {
      console.error("Login failed :", error);
    },
  });
};

export default useLogin;
