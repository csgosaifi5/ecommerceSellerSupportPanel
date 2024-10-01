"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { PropsWithChildren, use } from "react";
import { toast } from "sonner";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const { userDetails, loading } = useAuthStore();
    const router = useRouter();

    if (loading) {
        return <Skeleton className="h-[80vh]  bg-gray-300 container-main mx-10 my-10 rounded-xl" />;
    };

    if (!userDetails) {
        setTimeout(() => {
            router.push("/");
        }, 1000);
        return <Skeleton className="h-[80vh]  bg-gray-300 container-main mx-10 my-10 rounded-xl" />;
    }


    return <>{children}</>;
};

export default ProtectedRoute;