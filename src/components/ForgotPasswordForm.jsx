import { useForm } from "react-hook-form";
import useForgotPassword from "../hooks/useForgotPassword";

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    mutate: forgotPassword,
    isLoading,
    isError,
    error,
  } = useForgotPassword();

  const onSubmit = async (data) => {
    const filteredData = {
      user: {
        email: data.email,
      },
    };

    forgotPassword(filteredData);
  };

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

        <input type="submit" disabled={isLoading} />
      </form>
      {isError && <p>Reset password failed: {error.message}</p>}
    </div>
  );
};

export default ForgotPasswordForm;
