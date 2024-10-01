"use client";
import Logo from "../shared/logo";
import { DialogHeader } from "../ui/dialog";
import FormProvider from "../ui/form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Fragment, useEffect, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useStepper } from "@/context/stepper-context";
import {
  useAuthLoginWithOTP,
  useAuthVerifyLoginOTP,
} from "@/lib/react-query/user-query";
import { useRouter, useSearchParams } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAuthStore } from "@/context/auth-context";

const otpFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be less than 255 characters" }),
  otp: z.string().length(4, { message: "OTP must be 4 characters" }),
});

type LoginFormValues = z.infer<typeof otpFormSchema>;

const OTPForm = () => {
  const { prevStep, nextStep } = useStepper();
  const { setUser } = useAuthStore();
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const params = useSearchParams();
  const redirectTO = params.get("redirect");
  const forgotPassword = params.get("forgotPassword");
  const defaultValues: LoginFormValues = {
    email: params.get("email") || "",
    otp: "",
  };

  const { mutate, isPending } = useAuthVerifyLoginOTP(false);

  const { mutate: sendOTP, isPending: sendingOTP } = useAuthLoginWithOTP();

  const resendOTP = () => {
    sendOTP({ email: form.getValues("email") });
  };

  const form = useForm({
    resolver: zodResolver(otpFormSchema),
    defaultValues,
  });

  const email = form.watch("email");
  useEffect(() => {
    console.log(params.get("email"));
    form.setValue("email", params.get("email") || "");
  }, [params]);

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: (data) => {
        if (forgotPassword) {
          nextStep();
        } else {
          if (redirectTO) router.push(redirectTO);
          setUser(data.data.result);
          closeButtonRef.current?.click();
        }
      },
    });
  };

  const otp = form.watch("otp");
  return (
    <Fragment>
      <DialogHeader className=" w-full items-center flex justify-center">
        <Logo />
      </DialogHeader>
      <section className="flex flex-col p-8">
        <DialogClose ref={closeButtonRef} />
        <main>
          <FormProvider
            className="mt-8 space-y-4"
            methods={form}
            onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
          >
            <h2 className=" text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="">
              {email}{" "}
              <Button
                variant={"link"}
                onClick={prevStep}
                className="px-0 h-auto  font-medium text-sm py-0 text-primary"
              >
                Change
              </Button>
            </p>
            <div>
              <Label className="mb-4 block">
                Enter OTP sent to your email address
              </Label>
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(value) => form.setValue("otp", value)}
              >
                <InputOTPGroup className="flex gap-4 w-full">
                  <InputOTPSlot className="flex-1" index={0} />
                  <InputOTPSlot className="flex-1" index={1} />
                  <InputOTPSlot className="flex-1" index={2} />
                  <InputOTPSlot className="flex-1" index={3} />
                </InputOTPGroup>
              </InputOTP>
              {form.formState.errors.otp && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.otp.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2">
              <Button
                variant={"link"}
                onClick={prevStep}
                className="text-primary px-0 flex justify-start"
              >
                Login using Password
              </Button>
              <Button
                onClick={() => resendOTP()}
                disabled={sendingOTP}
                variant={"link"}
                type="button"
                className="text-primary px-0 flex justify-end"
              >
                {sendingOTP ? "Sending OTP..." : "Resend"}
              </Button>
            </div>
            <div className=" pt-2 pb-8">
              <Button disabled={isPending} className="block w-full">
                {isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>

            <div className="flex   justify-center">
              {` Don't have an account`}?&nbsp;
              <Button
                className="text-primary py-0 px-0 h-auto"
                variant={"link"}
              >
                Create new Account.
              </Button>
            </div>
          </FormProvider>
        </main>
      </section>
    </Fragment>
  );
};

export default OTPForm;
