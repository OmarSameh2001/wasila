"use client";
import InsuranceReportPDF from "@/app/(frontend)/_components/pdf/pdf";
import SingleRecordView from "@/app/(frontend)/_components/single_page/record/record";
import RecordCreate from "@/app/(frontend)/_components/single_page/record/record_create";
import { useParams } from "next/navigation";

export default function AdminRecord() {
  const params = useParams();

  if(params.id) return <InsuranceReportPDF id={params.id?.toString()} />;

  return null;
}
