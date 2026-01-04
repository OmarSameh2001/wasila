import Table from "../../_components/table/table";
import { brokersColumns, brokersList } from "../../_dto/user";

export default function AdminPolicy() {
  
  return (
    <div className="">
      <div className="p-5">
        <Table name="Brokers" columns={brokersColumns} data={brokersList} actions={[]} loading={false} query="adminBrokers" />
      </div>
    </div>
  );
}
