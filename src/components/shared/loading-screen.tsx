import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const LoadingScreen = ({ className }: PropsWithClassName) => {
    return (
        <Skeleton className={cn("flex justify-center items-center w-full h-full", className)}>
            <Loader2 className="animate-spin" />
        </Skeleton>
    );
}

export default LoadingScreen;