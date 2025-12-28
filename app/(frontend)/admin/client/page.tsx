import Table from "../../_components/table/table";
import { clientsColumns, clientsList } from "../../_dto/user";

export default function AdminPolicy() {
  
  return (
    <div className="">
      <div className="p-5">
        <Table name="Clients" columns={clientsColumns} data={clientsList} actions={[]} />
      </div>
    </div>
  );
}
