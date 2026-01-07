"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { clientsColumns } from "../../_dto/user";
import { getUsers } from "../../_services/user";

export default function AdminClients() {
  const { isLoading, data } = useQuery({
    queryKey: ["adminClients"],
    queryFn: () => getUsers(1, 10, ""),
  });
  return (
    <div className="">
      <div className="p-5">
        <Table
          name="Clients"
          columns={clientsColumns}
          data={data?.data.users ?? []}
          actions={[]}
          loading={isLoading}
          query="adminClients"
          pagination={{
            currentPage: 1,
            hasNextPage: false,
            itemsPerPage: 10,
            totalPages: 0,
            setCurrentPage: () => {},
            setItemsPerPage: () => {},
          }}
        />
      </div>
    </div>
  );
}
