import SingleRecordView from "@/app/(frontend)/_components/single_page/record/record";
import RecordCreate from "@/app/(frontend)/_components/single_page/record/record_create";

export default function AdminRecord({ params }: { params: { id: string } }) {
  if (params.id === "create") {
    return <RecordCreate />;
  }

  return <SingleRecordView />;
}
