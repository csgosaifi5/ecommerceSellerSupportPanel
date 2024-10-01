'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import { cn } from "@/lib/utils";

import Footer from "@/components/shared/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
    },
  },
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-[#F5F5F5]")}>
        <Suspense>
          <UserProvider >
            <QueryClientProvider client={queryClient}>
              <Toaster toastOptions={{duration:3000}}  position="top-right" richColors />
              <Navbar />
              {children}
              <Footer />
            </QueryClientProvider>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  );
}
