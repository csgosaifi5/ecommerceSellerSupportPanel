'use client';
import Logo from "../shared/logo"
import { DialogClose, DialogHeader } from "../ui/dialog";
import FormProvider from "../ui/form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../ui/form/FormInput";
import { z } from "zod";
import { Button } from "../ui/button";
import { useStepper } from "@/context/stepper-context";
import { useAuthRegister } from "@/lib/react-query/user-query";
import { usePathname, useRouter } from 'next/navigation'
import { useRef } from "react";

const signupFormSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }).max(255, { message: "Email must be less than 255 characters" }),
});

type RegisterFormValues = z.infer<typeof signupFormSchema>;

const defaultValues: RegisterFormValues = {
    email: ""
};

const RegisterForm = () => {

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();
    const pathname = usePathname();

    const { nextStep, goToStep } = useStepper();
    const form = useForm({
        resolver: zodResolver(signupFormSchema),
        defaultValues
    });

    const { mutate, isPending } = useAuthRegister();

    const onSubmit = (data: RegisterFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push(`${pathname}?email=${data.email}`);
                nextStep();
            }
        });
    }

    const openLogin = () => {
        goToStep(0);
    }

    return (
        <>
            <DialogHeader className=" flex items-center justify-center">
                <Logo />
            </DialogHeader>
            <section className="flex flex-col p-8">
                <main>
                    <FormProvider className="mt-4 space-y-4" methods={form} onSubmit={form.handleSubmit(onSubmit)} >
                        <h2 className=" text-2xl font-bold text-gray-900">Create your new account</h2>
                        <FormInput control={form.control} label="Email" placeholder="johndoe@gmail.com" name="email" type="email" />
                        <div className="py-8">
                            <Button disabled={isPending} className="block  w-full">
                                {isPending ? "Loading..." : "Continue"}
                            </Button>
                        </div>

                        <span className="flex justify-center">
                            Already have an account?&nbsp;
                            <DialogClose ref={closeButtonRef} />
                            <Button onClick={openLogin} type="button" className="text-primary py-0 px-0 h-auto" variant={'link'} >
                                Sign in.
                            </Button>
                        </span>
                    </FormProvider>
                </main>
            </section>
        </>
    )
};

export default RegisterForm;

