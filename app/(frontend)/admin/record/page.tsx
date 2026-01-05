"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { recordsColumns } from "../../_dto/record";
import { getRecords } from "../../_services/record";
import { PopupContext } from "../../_components/utils/context/popup_provider";
import { useContext, useState } from "react";
import { useRouter } from 'next/navigation'
export default function AdminRecords() {

  const router = useRouter()

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["adminRecord"],
    queryFn: () => getRecords(1, 10, ""),
  });
  

  function handleAddNew() {
    router.push('/admin/record/create')
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
          query="adminRecord"
        />
      </div>
    </div>
  );
}
