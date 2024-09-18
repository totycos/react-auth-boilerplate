import { SubmitHandler, useForm } from "react-hook-form";
import useResetPassword from "../hooks/useResetPassword";

type ResetPasswordFormInputs = {
  password: string;
  passwordConfirmation: string;
};

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormInputs>();
  const {
    mutate: resetPassword,
    isPending,
    isError,
    error,
  } = useResetPassword();
  const resetToken = new URLSearchParams(window.location.search).get(
    "reset_token"
  );

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    if (!resetToken) throw new Error("Reset token not found");

    const filteredData = {
      user: {
        reset_password_token: resetToken,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      },
    };

    resetPassword(filteredData);
  };

  return (
    <div className="registerForm">
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <input type="submit" disabled={isPending} />
      </form>
      {isError && <p>Reset password failed: {error.message}</p>}
    </div>
  );
};

export default ResetPasswordForm;
