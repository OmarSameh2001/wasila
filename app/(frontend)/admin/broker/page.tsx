"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { brokersColumns, brokersList } from "../../_dto/user";
import { getBrokers } from "../../_services/user";

export default function AdminBrokers() {
  const { isLoading, data } = useQuery({
    queryKey: ["adminBrokers"],
    queryFn: () => getBrokers(1, 10, ""),
  });
  return (
    <div className="">
      <div className="p-5">
        <Table name="Brokers" columns={brokersColumns} data={data?.data.users ?? []} actions={[]} loading={isLoading} query="adminBrokers" />
      </div>
    </div>
  );
}
