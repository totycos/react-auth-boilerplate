import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

type LoginData = {
  user: {
    email: string;
    password: string;
  };
};

const useLogin = () => {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (credentials: LoginData) =>
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
