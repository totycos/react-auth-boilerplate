import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useAuthContext } from "../contexts/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });
  const { mutate: loginUser, isPending, isError, error } = useLogin();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    loginUser({
      user: {
        email: data.email,
        password: data.password,
      },
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/`);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="loginForm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input
          type="email"
          {...register("email")}
          placeholder="Email here"
          autoComplete="current-email"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          type="password"
          {...register("password")}
          placeholder="Password here"
          autoComplete="current-password"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <input type="submit" disabled={isPending} />
      </form>
      {isError && <p>Login failed: {error.message}</p>}
    </div>
  );
};

export default LoginForm;
