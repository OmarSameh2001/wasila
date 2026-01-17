"use client";
import InsuranceQoutePDF from "@/app/(frontend)/_components/pdf/pdf";
import { useParams } from "next/navigation";

export default function AdminRecord() {
  const params = useParams();

  if(params.id) return <InsuranceQoutePDF id={params.id?.toString()} />;

  return null;
}
