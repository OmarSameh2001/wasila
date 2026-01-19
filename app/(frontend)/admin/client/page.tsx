"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { clientsColumns } from "../../_dto/user";
import { getUsers } from "../../_services/user";
import { useState } from "react";
import DynamicFilter from "../../_components/fliter/filter_bar";
import { filterableCLientColumns } from "../../_dto/general";

export default function AdminClients() {
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["adminClients", searchParams, currentPage, itemsPerPage],
    queryFn: () => getUsers(currentPage, itemsPerPage, searchParams),
  });
  return (
    <div className="min-h-[90vh] bg-gray-200 dark:bg-black">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterableCLientColumns}
        />

        <Table
          name="Clients"
          base="client"
          columns={clientsColumns}
          data={data?.data.users ?? []}
          actions={[]}
          loading={isLoading}
          query="adminClients"
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
