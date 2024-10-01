"use client";
import { AuthFlowForm } from "@/components/forms/login";
import { Dialog } from "@/components/ui/dialog";
import { useAuthStore } from "@/context/auth-context";
import { StepperProvider } from "@/context/stepper-context";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { userDetails, loading } = useAuthStore();
  const router = useRouter();
  const params = useSearchParams();
  const RedirectUrl = params.get("redirect");

  useEffect(() => {
    if (!loading && userDetails && !RedirectUrl) router.push("/");
  });

  if (userDetails || loading) {
    return (
      <div className="text-center min-h-[80vh] text-lg  py-20">
        Redirecting...
      </div>
    );
  }

  return (
    <StepperProvider initialStep={0}>
      <Dialog>
        <div className="p-4 mx-auto rounded-lg my-20 max-w-lg bg-white">
          <AuthFlowForm />
        </div>
      </Dialog>
    </StepperProvider>
  );
};

export default LoginPage;
