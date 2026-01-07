"use client";
import SingleRecordView from "@/app/(frontend)/_components/single_page/record/record";
import RecordCreate from "@/app/(frontend)/_components/single_page/record/record_create";
import { useParams } from "next/navigation";

export default function AdminRecord() {
  const params = useParams();
  if (params.id === "create") {
    return <RecordCreate />;
  }

  return <SingleRecordView />;
}
