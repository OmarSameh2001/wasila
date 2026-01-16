"use client";
import { useState } from "react";
import {
  policyColumns,
} from "../../../_dto/policy";
import {
  getPolicies,
} from "../../../_services/policy";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { filterablePolicyColumns } from "../../../_dto/general";
import DynamicFilter from "../../fliter/filter_bar";
import Table from "../../table/table";

export default function ProductsByType({ type }: { type: string }) {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filterType = type === "sme" ? `type=SME&` : "type=Individual_Medical&";
  const { isLoading, data } = useQuery({
    queryKey: [type + "_products", searchParams, currentPage, itemsPerPage],
    queryFn: () => getPolicies(currentPage, itemsPerPage, filterType + searchParams),
  });

  function handleAddNew() {
    router.push('/admin/policy/create')
  }
  
  return (
    <div className="">
      <div className="p-5">
        <DynamicFilter onSearch={setSearchParams} fields={filterablePolicyColumns} />

        <Table
          name="Products"
          buttonName="Add New Product"
          columns={policyColumns}
          data={data?.data?.data}
          actions={[
          ]}
          loading={isLoading}
          addNew={handleAddNew}
          query="products"
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
