import Table from "../../_components/table/table";
import { companiesColumns, companiesList } from "../../_dto/company";

export default function AdminCompany() {
  
  return (
    <div className="">
      <div className="p-5">
        <Table name="Companies" columns={companiesColumns} data={companiesList} actions={[]} />
      </div>
    </div>
  );
}
