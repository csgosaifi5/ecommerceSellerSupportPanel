'use client'
import Logo from "../shared/logo"
import { DialogHeader } from "../ui/dialog";
import FormProvider from "../ui/form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Fragment, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useStepper } from "@/context/stepper-context";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthLoginWithOTP, useAuthRegister, useAuthVerifyLoginOTP, useAuthVerifySignUpOTP } from "@/lib/react-query/user-query";
import { toast } from "sonner";

const otpFormSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }).max(255, { message: "Email must be less than 255 characters" }),
    otp: z.string().length(4, { message: "OTP must be 6 characters" })
});

type LoginFormValues = z.infer<typeof otpFormSchema>;



const RegisterOTPForm = () => {
    const { nextStep, prevStep } = useStepper();
    const params = useSearchParams();
    const defaultValues: LoginFormValues = {
        email: params.get('email') || "",
        otp: ""
    };

    const { mutate, isPending } = useAuthVerifySignUpOTP();
    const { mutate: sendOTP, isPending: sendingOTP } = useAuthLoginWithOTP();

    const form = useForm({
        resolver: zodResolver(otpFormSchema),
        defaultValues
    });


    useEffect(() => {
        form.setValue("email", params.get("email")||"");
    }, [params, form]);


    const resendOTP = () => {
        sendOTP({ email: form.getValues("email") } );
    }

    const onSubmit = (data: LoginFormValues) => {
        mutate(data, {
            onSuccess: () => {
                nextStep();
            }
        });
    };

    const otp = form.watch("otp")
    return (
        <Fragment>
            <DialogHeader className=" w-full items-center flex justify-center">
                <Logo />
            </DialogHeader>
            <section className="flex flex-col p-8">
                <main>
                    <FormProvider className="mt-8 space-y-4" methods={form} onSubmit={form.handleSubmit(onSubmit, (err) => { console.error(err) })} >
                        <h2 className=" text-2xl font-bold text-gray-900">Verify your Email </h2>
                        <p className="">{params.get("email")} <Button variant={'link'} onClick={prevStep} type="button" className="px-0 h-auto  font-medium text-sm py-0 text-primary">Change</Button></p>
                        <div>
                            <Label className="mb-4 block">Enter OTP sent to your email address</Label>
                            <InputOTP maxLength={6} value={otp} onChange={(value) => form.setValue("otp", value)}>
                                <InputOTPGroup className="flex gap-4 w-full">
                                    <InputOTPSlot className="flex-1" index={0} />
                                    <InputOTPSlot className="flex-1" index={1} />
                                    <InputOTPSlot className="flex-1" index={2} />
                                    <InputOTPSlot className="flex-1" index={3} />
                                </InputOTPGroup>
                            </InputOTP>
                            {form.formState.errors.otp && <p className="text-red-500 text-sm">{form.formState.errors.otp.message}</p>}
                        </div>
                        <div className="flex justify-end">
                            <Button  onClick={() => resendOTP()} disabled={sendingOTP} variant={'link'} type="button" className="text-primary px-0 flex justify-end">
                                {sendingOTP ? "Sending OTP..." : "Resend"}
                            </Button>
                        </div>
                        <div className=" pt-2 pb-8">
                            <Button disabled={isPending} className="block w-full">
                                {isPending ? "Loading..." : "Verify OTP"}
                            </Button>
                        </div>

                    </FormProvider>
                </main>
            </section>
        </Fragment>
    )
};

export default RegisterOTPForm;