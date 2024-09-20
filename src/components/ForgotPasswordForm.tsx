import { useForm, SubmitHandler } from "react-hook-form";
import useForgotPassword from "../hooks/useForgotPassword";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof ForgotPasswordFormSchema>;

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  });
  const {
    mutate: forgotPassword,
    isPending,
    isError,
    error,
  } = useForgotPassword();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    forgotPassword({
      user: {
        email: data.email,
      },
    });
  };

  return (
    <div className="loginForm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input
          type="email"
          {...register("email")}
          placeholder="Email here"
          autoComplete="current-email"
        />
        {errors.email && <p> {errors.email.message} </p>}

        <input type="submit" disabled={isPending} />
      </form>
      {isError && <p>Reset password failed: {error.message}</p>}
    </div>
  );
};

export default ForgotPasswordForm;
