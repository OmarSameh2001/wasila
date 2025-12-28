import Table from "../../_components/table/table";
import { recordsColumns, recordsList } from "../../_dto/record";

export default function AdminPolicy() {
  
  return (
    <div className="">
      <div className="p-5">
        <Table name="Records" columns={recordsColumns} data={recordsList} actions={[]} />
      </div>
    </div>
  );
}
