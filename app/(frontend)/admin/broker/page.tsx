"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { brokersColumns } from "../../_dto/user";
import { getBrokers } from "../../_services/user";
import { useState } from "react";
import { filterableBrokerColumns } from "../../_dto/general";
import DynamicFilter from "../../_components/fliter/filter_bar";

export default function AdminBrokers() {
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["adminBrokers", searchParams, currentPage, itemsPerPage],
    queryFn: () => getBrokers(currentPage, itemsPerPage, searchParams),
  });
  return (
    <div className="min-h-[90vh] bg-gray-200 dark:bg-black">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterableBrokerColumns}
        />
        <Table
          name="Brokers"
          base="broker"
          columns={brokersColumns}
          data={data?.data.users ?? []}
          actions={[]}
          loading={isLoading}
          query="adminBrokers"
          pagination={{
            currentPage,
            setCurrentPage,
            totalPages: data?.data?.totalPages || 1,
            hasNextPage: data?.data?.hasNextPage || false,
            itemsPerPage,
            setItemsPerPage,
          }}
        />
      </div>
    </div>
  );
}
