import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister";
import { useAuthContext } from "../contexts/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterFormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type RegisterForm = z.infer<typeof RegisterFormSchema>;

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
  });
  const { mutate: registerUser, isPending, isError, error } = useRegister();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    registerUser({
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
    <div className="registerForm">
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
      {isError && <p>Registration failed: {error.message}</p>}
    </div>
  );
};

export default RegisterForm;
