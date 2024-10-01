"use client";
import { PropsWithChildren, useRef } from "react";
import Logo from "../shared/logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import FormProvider from "../ui/form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../ui/form/FormInput";
import { z } from "zod";
import FormCheckbox from "../ui/form/form-checkbox";
import { Button } from "../ui/button";
import { StepperProvider, useStepper } from "@/context/stepper-context";
import OTPForm from "./otp-form";
import FormPassword from "../ui/form/FormPassword";
import {
  useAuthLogin,
  useAuthLoginWithOTP,
} from "@/lib/react-query/user-query";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import UpdatePasswordForm from "./update-password-form";
import RegisterForm from "./signup-form";
import RegisterOTPForm from "./otp-register-form";
import UserRegisterForm from "./register-form";

const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const { nextStep, goToStep } = useStepper();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const redirectTO = params.get("redirect");
  const { mutate: loginWithOTPMutate, isPending: sendingOTP } =
    useAuthLoginWithOTP();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { mutate, isPending } = useAuthLogin();
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  const email = form.watch("email");

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: () => {
        if (redirectTO) {
          router.push(redirectTO);
        }
        closeDialog();
      },
    });
  };
  const loginWithOTP = (forgotPassword: boolean = false) => {
    if (!email) return form.setError("email", { message: "Email is required" });

    if (!email.includes("@"))
      return form.setError("email", { message: "Invalid email format" });

    loginWithOTPMutate(
      { email: form.getValues().email },
      {
        onSuccess: () => {
          if (forgotPassword)
            router.push(
              `${pathname}?email=${form.getValues("email")}&forgotPassword=true`
            );
          else router.push(`${pathname}?email=${form.getValues("email")}`);

          nextStep();
        },
      }
    );
  };
  const closeDialog = () => {
    closeButtonRef.current?.click();
  };
  const openSignUp = () => {
    goToStep(3);
  };
  return (
    <>
      <DialogHeader className=" flex items-center justify-center">
        <Logo />
      </DialogHeader>
      <DialogClose ref={closeButtonRef} />
      <section className="flex flex-col p-8">
        <main>
          <FormProvider
            className=" space-y-4"
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className=" text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <FormInput
              control={form.control}
              label="Email"
              name="email"
              type="email"
            />
            <FormPassword
              control={form.control}
              label="Password"
              name="password"
              type="password"
            />
            <div className="grid grid-cols-2">
              <div />
              <Button
                variant={"link"}
                type="button"
                disabled={sendingOTP}
                onClick={() => loginWithOTP()}
                className="text-primary px-0 w-fit ml-auto"
              >
                Login using OTP
              </Button>
            </div>
            <div className="space-y-2 pt-2">
              <Button disabled={isPending} className="block w-full">
                {isPending ? "Loading..." : "Sign In"}
              </Button>

              <Button
                variant={"link"}
                disabled={sendingOTP}
                type="button"
                onClick={() => loginWithOTP(true)}
                className="block w-full"
              >
                Forgot password?
              </Button>
            </div>

            <span className="flex justify-center">
              {` Don't have an account?`}&nbsp;
              <Button
                onClick={openSignUp}
                className="text-primary py-0 px-0 h-auto"
                variant={"link"}
              >
                Create new Account.
              </Button>
            </span>
          </FormProvider>
        </main>
      </section>
    </>
  );
};

export const AuthFlowForm = () => {
  const { currentStep } = useStepper();
  return (
    <>
      {currentStep === 0 && <LoginForm />}
      {currentStep === 1 && <OTPForm />}
      {currentStep === 2 && <UpdatePasswordForm />}
      {currentStep === 3 && <RegisterForm />}
      {currentStep === 4 && <RegisterOTPForm />}
      {currentStep === 5 && <UserRegisterForm />}
    </>
  );
};

type Props = {
  children: React.ReactNode;
  defaultOpen?: boolean;
  intialStep?: number;
};

const AuthFormDialog = ({ children, defaultOpen, intialStep }: Props) => {

  return (
    <StepperProvider
      initialStep={intialStep}
      key={intialStep}
    >
      <DialogForm  defaultOpen={defaultOpen}  >
        {children}
        </DialogForm>
    </StepperProvider>
  );
};

const DialogForm = ({ children, defaultOpen }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.push(pathname);
    }
  };

  return (
    <Dialog
      key={String(defaultOpen)}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <AuthFlowForm />
      </DialogContent>
    </Dialog>
  );
};

export default AuthFormDialog;
