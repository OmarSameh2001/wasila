"use client";
import { useState } from "react";
import Table from "../../_components/table/table";
import {
  policyColumns,
} from "../../_dto/policy";
import {
  getPolicies,
} from "../../_services/policy";
import { InvalidateQueryFilters, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { filterablePolicyColumns } from "../../_dto/general";
import DynamicFilter from "../../_components/fliter/filter_bar";

export default function AdminPolicy() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["adminPolicies", searchParams, currentPage, itemsPerPage],
    queryFn: () => getPolicies(currentPage, itemsPerPage, searchParams),
  });

  function handleAddNew() {
    router.push('/admin/policy/create')
  }
  
  return (
    <div className="">
      <div className="p-5">
        <DynamicFilter onSearch={setSearchParams} fields={filterablePolicyColumns} />

        <Table
          name="Policies"
          columns={policyColumns}
          data={data?.data?.data}
          actions={[
          ]}
          loading={isLoading}
          addNew={handleAddNew}
          query="adminPolicies"
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
