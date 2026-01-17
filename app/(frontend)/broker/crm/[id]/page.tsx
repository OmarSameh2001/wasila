"use client";
import SingleQouteView from "@/app/(frontend)/_components/single_page/crm/qoute";
import RecordCreate from "@/app/(frontend)/_components/single_page/crm/create_qoute";
import { useParams } from "next/navigation";

export default function AdminRecord() {
  const params = useParams();
  if (params.id === "create") {
    return <RecordCreate />;
  }

  if(params.id) return <SingleQouteView id={params.id?.toString()} />;

  return null;
}
