import { SubmitHandler, useForm } from "react-hook-form";
import useResetPassword from "../hooks/useResetPassword";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type ResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });
  const {
    mutate: resetPassword,
    isPending,
    isError,
    error,
  } = useResetPassword();
  const resetToken = new URLSearchParams(window.location.search).get(
    "reset_token"
  );

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    if (!resetToken) throw new Error("Reset token not found");

    resetPassword({
      user: {
        reset_password_token: resetToken,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      },
    });
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
        {errors.password && <p>{errors.password.message}</p>}

        <input
          type="password"
          {...register("passwordConfirmation")}
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
