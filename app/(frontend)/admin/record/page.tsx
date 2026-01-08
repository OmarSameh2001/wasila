"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { recordsColumns } from "../../_dto/record";
import { getRecords } from "../../_services/record";
import { useRouter } from "next/navigation";
export default function AdminRecords() {
  const router = useRouter();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["adminRecords"],
    queryFn: () => getRecords(1, 10, ""),
  });

  function handleAddNew() {
    router.push("/admin/record/create");
  }
  console.log(data);
  return (
    <div className="">
      <div className="p-5">
        <Table
          name="Records"
          columns={recordsColumns}
          data={data?.data?.data ?? []}
          actions={[]}
          loading={isLoading}
          addNew={handleAddNew}
          query="adminRecords"
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
