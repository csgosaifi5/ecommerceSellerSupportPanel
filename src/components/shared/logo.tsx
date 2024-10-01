import { cn } from "@/lib/utils";

const Logo = ({ className, dark = false }: { className?: string, dark?: boolean }) => {
    
    return (
        <img src={!dark?"/images/logo.svg":"/images/logo-dark.svg"} className={cn("w-[154px] h-10", className)} alt="Logo" />
    );
};

export default Logo;