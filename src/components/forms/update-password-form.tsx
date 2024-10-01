import { useUpdateUserData } from "@/lib/react-query/user-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import FormProvider from "../ui/form/FormProvider";
import FormInput from "../ui/form/FormInput";
import { Button } from "../ui/button";
import FormPassword from "../ui/form/FormPassword";

const formSchema = z.object({
    password: z.string(),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
    password: "",
    confirmPassword: ""
};
const UpdatePasswordForm = () => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const { mutate, isPending } = useUpdateUserData();

    const onSubmit = (data: FormValues) => {
        mutate(data);
    }

    return (
        <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold"> Update Password </h2>
                <p className="text-gray-600 font-medium">
                    please enter your new password
                </p>
                <FormPassword control={form.control} name="password" label="Password" type="password" />
                <FormPassword control={form.control} name="confirmPassword" label="Confirm Password" type="password" />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Loading..." : "Update Password"}
                </Button>
            </div>
        </FormProvider>
    );

};

export default UpdatePasswordForm;