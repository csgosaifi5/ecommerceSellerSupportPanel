import { z } from "zod";
import FormProvider from "../ui/form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../ui/form/FormInput";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import {
  useCurrentUser,
  useUpdateUserData,
} from "@/lib/react-query/user-query";
import { useEffect, useMemo } from "react";
import { User } from "@/models/user";
import { fileToBase64, objectToFormData } from "@/lib/utils";

const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  last_name: z.string().optional(),
  profile_image: z.any().optional(),
  email: z.string().email(),
  phone: z.string().refine((value) => !Number.isNaN(value), {
    message: "Invalid phone number",
  }),
  company_name: z.string().optional(),
  address_1: z.string().min(2, { message: "Address is Required" }),
  address_2: z.string().optional(),
  city: z.string().min(2, { message: "City is Required" }),
  state: z.string().min(2, { message: "State is Required" }),
  zipcode: z
    .string()
    .min(5, "Zip code must be 5 digit")
    .max(5, "Zip code must be 5 digit")
    .refine((value) => !Number.isNaN(value), { message: "Invalid zip code" }),
  country: z.string().min(2, { message: "Country is Required" }),
});

type FormValues = z.infer<typeof personalInfoSchema>;

type Props = {
  onCanceled?: () => void;
};

const EditProfileForm = ({ onCanceled = () => {} }: Props) => {
  const { data, isSuccess } = useCurrentUser();
  const { mutate: updateUser, isPending } = useUpdateUserData();

  const form = useForm<FormValues>({
    defaultValues: {},
    resolver: zodResolver(personalInfoSchema),
  });

  const onHandleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue("profile_image", base64);
    }
  };

  const profile_image = form.watch("profile_image");
  const onSubmit = (data: FormValues) => {
    const formData = objectToFormData(data, ["profile_image"]);
    updateUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      const user = new User(data.data);
      form.reset(user as any);
    }
  }, [data, isSuccess]);


  return (
    <FormProvider
      className="w-full"
      methods={form}
      onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
    >
      <div className="flex w-full gap-8">
        <label className="w-44 h-44 relative rounded-[30px] overflow-hidden">
          <div className="w-full bg-black bg-opacity-45 absolute h-full z-10 flex justify-center items-center">
            <Camera className="fill-white relative z-10" />
          </div>
          <img
            src={profile_image || "/images/illustrations/default-user.avif"}
            className="w-full relative z-0 h-full object-cover"
            alt=""
          />
          <input
            accept="image/*"
            type="file"
            onChange={(e) => onHandleFileChange(e)}
            className=" invisible relative -z-10"
          />
        </label>
        <div className="grid md:grid-cols-2 w-full max-w-4xl grid-cols-1 gap-5">
          <FormInput
            control={form.control}
            name="first_name"
            label="First Name*"
          />
          <FormInput
            control={form.control}
            name="last_name"
            label="Last Name"
          />
          <FormInput
            control={form.control}
            name="email"
            disabled
            label="Email*"
          />
          <div />
          <FormInput control={form.control} name="phone" label="Phone" />
          <FormInput
            control={form.control}
            name="company_name"
            label="Company"
          />
          <FormInput
            control={form.control}
            name="address_1"
            label="Address Line 1*"
          />
          <FormInput
            control={form.control}
            name="address_2"
            label="Address Line 2"
          />
          <FormInput control={form.control} name="city" label="City*" />
          <FormInput control={form.control} name="state" label="State*" />
          <FormInput control={form.control} name="zipcode" label="Zip Code*" />
          <FormInput control={form.control} name="country" label="Country*" />
        </div>
      </div>

      <div className="flex justify-end gap-5 mt-4 py-4">
        <Button onClick={onCanceled} type="submit" variant="outline">
          Cancel
        </Button>
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </FormProvider>
  );
};

export default EditProfileForm;
