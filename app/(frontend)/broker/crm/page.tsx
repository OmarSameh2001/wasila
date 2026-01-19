"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { recordsColumns } from "../../_dto/record";
import { getRecords } from "../../_services/record";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { filterableRecordColumns } from "../../_dto/general";
import DynamicFilter from "../../_components/fliter/filter_bar";
export default function AdminQoutes() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["qoutes", searchParams, currentPage, itemsPerPage],
    queryFn: () => getRecords(currentPage, itemsPerPage, searchParams),
  });

  function handleAddNew() {
    router.push("/admin/crm/create");
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
          name="Qoutes"
          base="crm"
          columns={recordsColumns.filter((col) => col.key !== "broker")}
          data={data?.data?.data ?? []}
          actions={[{name: "PDF"}]}
          addNew={handleAddNew}
          buttonName="Get Qoute"
          loading={isLoading}
          query="qoutes"
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
