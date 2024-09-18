import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

type RegisterData = {
  user: {
    email: string;
    password: string;
  };
};

const useRegister = () => {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (credentials: RegisterData) =>
      axiosInstance.post("users/", credentials),
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
