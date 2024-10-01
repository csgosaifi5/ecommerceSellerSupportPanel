"use client";
import { PropsWithChildren, useRef } from "react";
import Logo from "../shared/logo";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import FormProvider from "../ui/form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../ui/form/FormInput";
import { z } from "zod";
import { Button } from "../ui/button";
import FormPassword from "../ui/form/FormPassword";
import { useUpdateUserData } from "@/lib/react-query/user-query";

const userFormSchema = z
  .object({
    first_name: z.string().min(2, "first name must be at least 2 characters"),
    last_name: z.string().min(2, "last name must be at least 2 characters"),
    phone: z.string().regex(/^\d{10}$/),
    password: z.string().min(1, "password must be at least 1 character"),
    confirmPassword: z.string().min(1, "password must be at least 1 character"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userFormSchema>;

const defaultValues: UserFormValues = {
  first_name: "",
  last_name: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const UserRegisterForm = () => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const { mutate, isPending } = useUpdateUserData();

  const onSubmit = (data: UserFormValues) => {
    mutate(data, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const closeDialog = () => {
    closeButtonRef.current?.click();
  };

  return (
    <>
      <DialogHeader className=" flex items-center justify-center">
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
              Create your new account
            </h2>
            <FormInput
              control={form.control}
              label="First Name*"
              name="first_name"
              type="text"
            />
            <FormInput
              control={form.control}
              label="Last Name*"
              name="last_name"
              type="text"
            />
            <FormInput
              control={form.control}
              label="Phone Number*"
              name="phone"
              type="text"
            />
            <FormPassword
              control={form.control}
              label="Password*"
              name="password"
            />
            <FormPassword
              control={form.control}
              label="Confirm Password*"
              name="confirmPassword"
            />
            <div className="space-y-2 pt-2">
              <Button disabled={isPending} className="block w-full">
                {isPending ? "Loading..." : "Register"}
              </Button>
            </div>
          </FormProvider>
        </main>
      </section>
    </>
  );
};

export default UserRegisterForm;
