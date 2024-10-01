"use client";
import PaymentMethodForm from "@/components/forms/payment-method-form";
import EditProfileForm from "@/components/forms/edit-profile-form";
import PaymentMethods from "@/components/sections/profile/payment";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import { useAddPaymentMethod } from "@/lib/react-query/payment-methods-query";
import { Building, Mail, MapPin, Pen, Phone, Pin, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { profile } from "console";

const defaultValues = {
  platform: "cash-app",
  default_method: false,
  label: "",
  details: "",
};

const ProfilePage = () => {
  const { userDetails } = useAuthStore();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  const { isPending, mutate } = useAddPaymentMethod();

  const onSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        setShowAddPaymentMethod(false);
      },
    });
  };

  const address = useMemo(() => {
    if (!userDetails) return "";
    return `${userDetails?.address_1 || ""} ${userDetails?.address_2 || ""} ${
      userDetails?.address_3 || ""
    } ${userDetails?.city || ""} ${userDetails?.state || ""} ${
      userDetails?.zipcode || ""
    } ${userDetails?.country || ""}`;
  }, [userDetails]);

  return (
    <section className="container-main pt-10 min-h-[calc(100vh-80px)]">
      <h2 className="text-xl pl-2 font-semibold mb-4">Profile</h2>
      {!showEditForm && (
        <div className="p-8 bg-white rounded-[30px] flex">
          <div className="w-44 h-44 border-[#FFE7D5] border-4 overflow-hidden bg-gray-200 rounded-[30px]">
            <img
              className="w-full h-full object-cover"
              src={
                userDetails?.profile_image ||
                "/images/illustrations/default-user.avif"
              }
              alt=""
            />
          </div>
          <div className="py-3 text-[#333] flex flex-col justify-between px-6">
            <p className="text-2xl font-semibold">{userDetails?.fullName}</p>
            <div className="flex items-center gap-x-3">
              <Mail color="#333" />
              <p>{userDetails?.email}</p>
              <div className="bg-[#333] h-5 w-px" />
              <Phone color="#333" size={22} />
              <p className="text-[#333]">{userDetails?.phone}</p>
            </div>
            <div className="flex gap-2">
              <Building color="#333" />
              <p>{userDetails?.company_name || "-"}</p>
            </div>
            <div className="flex gap-2">
              <MapPin color="#333" />
              <p>{address || "-"}</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button
              onClick={() => setShowEditForm(true)}
              size={"sm"}
              variant={"ghost"}
            >
              <Pen className="text-primary" />
            </Button>
          </div>
        </div>
      )}
      {showEditForm && (
        <div className="p-8 bg-white rounded-[30px] flex flex-col ">
          <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
          <EditProfileForm onCanceled={() => setShowEditForm(false)} />
        </div>
      )}
      <div className="flex justify-between items-end py-4">
        <h2 className="text-xl pl-2 mt-12 font-semibold ">Payout Preference</h2>
        <Button
          disabled={showAddPaymentMethod}
          onClick={() => {
            setShowAddPaymentMethod(true);
          }}
          size={"sm"}
          className="flex gap-2"
          variant={"outline"}
        >
          <Plus size={20} className="text-white p-1 bg-primary rounded-full" />
          Add Payout Method
        </Button>
      </div>
      {showAddPaymentMethod && (
        <div className="p-8 space-y-6 bg-white rounded-[30px]">
          <h2 className="text-2xl font-semibold">Add Payout Preference</h2>
          <PaymentMethodForm
            isLoading={isPending}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            onCanceled={() => setShowAddPaymentMethod(false)}
          />
        </div>
      )}
      <PaymentMethods />
    </section>
  );
};

export default ProfilePage;
