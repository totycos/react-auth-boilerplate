import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axiosInstance from "../utils/axiosInstance";

const useRegister = () => {
  const { login } = useContext(AuthContext);

  return useMutation({
    mutationFn: (credentials) => axiosInstance.post("users/", credentials),
    onSuccess: (response) => {
      console.log("response:", response);
      const token = response.headers.authorization;
      login(token);
    },
    onError: (error) => {
      console.error("Registration failed :", error);
    },
  });
};

export default useRegister;
