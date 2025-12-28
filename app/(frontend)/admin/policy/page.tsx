import Table from "../../_components/table/table";
import { policiesList, policyColumns } from "../../_dto/policy";

export default function AdminPolicy() {
  
  return (
    <div className="">
      <div className="p-5">
        <Table name="Policies" columns={policyColumns} data={policiesList} actions={[]} />
      </div>
    </div>
  );
}
