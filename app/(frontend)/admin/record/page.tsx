"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { recordsColumns } from "../../_dto/record";
import { getRecords } from "../../_services/record";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { filterableRecordColumns } from "../../_dto/general";
import DynamicFilter from "../../_components/fliter/filter_bar";
export default function AdminRecords() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["adminRecords", searchParams, currentPage, itemsPerPage],
    queryFn: () => getRecords(currentPage, itemsPerPage, searchParams),
  });

  function handleAddNew() {
    router.push("/admin/record/create");
  }
  console.log(data);
  return (
    <div className="">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterableRecordColumns}
        />
        <Table
          name="Records"
          columns={recordsColumns}
          data={data?.data?.data ?? []}
          actions={[]}
          loading={isLoading}
          addNew={handleAddNew}
          query="adminRecords"
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
