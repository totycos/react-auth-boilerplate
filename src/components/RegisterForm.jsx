import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister";
import { useAuthContext } from "../contexts/AuthContext";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const { mutate: registerUser, isLoading, isError, error } = useRegister();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const filteredData = {
      user: {
        email: data.email,
        password: data.password,
      },
    };

    registerUser(filteredData);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/`);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="registerForm">
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

        <input
          type="password"
          {...register("passwordConfirmation", {
            validate: (value) =>
              value === getValues("password") || "The passwords do not match",
          })}
          placeholder="Confirm Password here"
          autoComplete="current-password"
        />
        {errors.passwordConfirmation && (
          <p>{errors.passwordConfirmation.message}</p>
        )}

        <input type="submit" disabled={isLoading} />
      </form>
      {isError && <p>Registration failed: {error.message}</p>}
    </div>
  );
};

export default RegisterForm;
