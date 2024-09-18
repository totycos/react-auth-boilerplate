import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useAuthContext } from "../contexts/AuthContext";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const { mutate: loginUser, isPending, isError, error } = useLogin();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const filteredData = {
      user: {
        email: data.email,
        password: data.password,
      },
    };

    loginUser(filteredData);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/`);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="loginForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email here"
          autoComplete="current-email"
        />
        {errors.email && errors.email.type === "required" && (
          <p>Email can not be empty</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p>{errors.email.message}</p>
        )}

        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 6,
          })}
          placeholder="Password here"
          autoComplete="current-password"
        />
        {errors.password && errors.password.type === "required" && (
          <p>Password can not be empty</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password should have 6 characters minimum</p>
        )}

        <input type="submit" disabled={isPending} />
      </form>
      {isError && <p>Login failed: {error.message}</p>}
    </div>
  );
};

export default LoginForm;
