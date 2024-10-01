'use client';
import ChatScreen from "@/components/sections/messages/chat-screen";
import OrdersSidebar from "@/components/sections/messages/orders-sidebar";
import { Suspense } from "react";

const MessagePage = () => {

    return (
        <Suspense>
            <section className="container-main flex flex-col  mb-12  min-h-[calc(100vh-90px)]">
                <h2 className="text-xl pl-2 mt-8 font-semibold mb-4">Messages</h2>
                <main className="grid grid-cols-12 border mb-2 border-[#D3D3D3] box-border overflow-hidden  rounded-[20px]  flex-1 h-full">
                    <div className="col-span-4 border-[#D3D3D3] bg-white border-r">
                        <OrdersSidebar/>
                    </div>
                    <div className="col-span-8 bg-[#F7F6F5]">
                        <ChatScreen  />
                    </div>
                </main>
            </section>
        </Suspense>
    )
}

export default MessagePage;