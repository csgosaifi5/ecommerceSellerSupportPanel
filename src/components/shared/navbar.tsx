"use client"
import { Button } from "@/components/ui/button";
import Logo from "./logo";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "../ui/nav-link";
import { MenuIcon, X } from "lucide-react";
import AuthFormDialog from "../forms/login";
import RegisterFormDialog from "../forms/signup-form";
import { useAuthStore } from "@/context/auth-context";
import UserMenu from "./user-menu";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/lib/react-query/user-query";
import { User } from "@/models/user";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import NoticationMenu from "./notications";

const guestNavItems = [
    { label: "Home", link: "/" },
    { label: "Start selling", link: "/selling" },
    { label: "About us", link: "/about" },
    { label: "Contact us", link: "/contact-us" },
];

const userNavItems = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Offers", link: "/offers" },
    { label: "Payouts", link: "/payouts" },
    { label: "Messages", link: "/messages" }
];

const Navbar = () => {

    const [mobileMenu, toggleMobileMenu] = useState(false);
    const { userDetails, setUser,setLoadig, loading } = useAuthStore();
    const params = useSearchParams();
    const { data, isSuccess,isError } = useCurrentUser();

    useEffect(() => {
        if (isSuccess) {
            const user = new User(data.data);
            setUser(user);
        }
        if(isError){
            console.log("error");
            setUser(null);
            setLoadig(false);
        }
        
    }, [data, isSuccess,isError]);

    const navItems = useMemo(() => {
        return userDetails == null ? guestNavItems : userNavItems;
    }, [userDetails]);
    const dialog = params.get("dialog");

    return (
        <>
            <nav className="bg-white">
                <div className="container-main items-center flex py-6 px-10">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="md:flex hidden   gap-8 ml-auto self-end">
                        {navItems.map((item, index) => (
                            <NavLink exact href={item.link} key={index} className="font-medium h-10 flex items-center  hover:text-primary/80">
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    {userDetails == null && !loading && <div className="md:flex hidden gap-4 ml-8">
                        <AuthFormDialog defaultOpen={dialog == 'login'} >
                            <Button size={"lg"} variant={'link'} className="px-0">Login</Button>
                        </AuthFormDialog>
                        <AuthFormDialog intialStep={3} defaultOpen={dialog == 'signup'}>
                            <Button size={"lg"} variant={"outline"} className="text-primary rounded-lg px-5 py-2.5 font-medium hover:text-primary hover:bg-primary/10">Get Started</Button>
                        </AuthFormDialog>
                    </div>}
                    {userDetails != null && !loading && <div className="md:flex hidden gap-4 ml-8">
                        <NoticationMenu/>
                        <UserMenu />
                    </div>}
                    {loading && <Skeleton className="md:flex hidden w-8 h-8 ml-8 rounded-xl" />}
                    <Button
                        onClick={() => {
                            toggleMobileMenu((mobileMenu) => !mobileMenu)
                        }}
                        variant={"ghost"} className="md:hidden z-50 relative ml-auto">
                        {!mobileMenu ? <MenuIcon /> : <X />}
                    </Button>
                </div>
            </nav>
            <nav
                className={cn(
                    mobileMenu ? "h-screen" : "h-0",
                    ` bg-white w-screen duration-500   transition-all fixed top-0 left-0 z-50 overflow-hidden "
              }`
                )}
            >
                <Button
                    onClick={() => {
                        toggleMobileMenu((mobileMenu) => !mobileMenu)
                    }}
                    variant={"ghost"}
                    className="md:hidden z-50  absolute right-10 top-6 ml-auto"
                >
                    {<X />}
                </Button>
                <section className=" flex flex-col gap-8 container-main pt-24">
                    {navItems.map((link, index) => (
                        <NavLink
                            className="border-b py-4 text-xl border-primary/20"
                            key={index}
                            exact
                            href={`${link.link.toLowerCase()}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </section>
            </nav>
        </>

    );
}

export default Navbar;