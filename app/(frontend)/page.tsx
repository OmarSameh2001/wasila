"use client";
import { useContext } from "react";
import { AuthContext } from "./_utils/context/auth";
import BrokerHomePage from "./broker/page";
import AdminHomePage from "./admin/page";
import LoadingPage from "./_utils/promise_handler/loading/loading";
import GuestHomepage from "./_components/single_page/guest/guest";

export default function Home() {
  const { isLoading, type } = useContext(AuthContext);
  return (
    <div className="flex justify-center bg-zinc-50 font-sans dark:bg-black flex-1">
      {isLoading ? (
        <LoadingPage />
      ) : type === "BROKER" ? (
        <BrokerHomePage />
      ) : type === "ADMIN" ? (
        <AdminHomePage />
      ) : (
        <GuestHomepage />
      )}
    </div>
  );
}
