"use client";
import { useContext, useMemo, useState } from "react";
import { policyColumns } from "../../../_dto/policy";
import { deletePolicy, getPolicies } from "../../../_services/policy";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  filterablePolicyColumns,
  TableActionButton,
} from "../../../_dto/general";
import DynamicFilter from "../../fliter/filter_bar";
import Table from "../../table/table";
import { AuthContext } from "../../../_utils/context/auth";

export default function ProductsByType({ type }: { type: string }) {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    isLoading: isLoadingAuth,
    type: authType,
    id: authId,
  } = useContext(AuthContext);
  const pathname = usePathname();

  const isBrokerWasila = pathname.includes("/broker/wasila-products");
  const isBrokerProduct =
    pathname.includes("/broker/product") && authType === "BROKER" && authId;
  const filterType = useMemo(() => {
    let filter = type === "sme" ? "type=SME&" : "type=Individual_Medical&";

    if (isBrokerWasila) {
      filter += "brokerId=null&";
    } else if (isBrokerProduct) {
      filter += `brokerId=${authId}&`;
    }

    return filter;
  }, [type, authType, isLoadingAuth, authId, isBrokerWasila, isBrokerProduct]);
  console.log(filterType);
  const { isLoading, data } = useQuery({
    queryKey: [
      filterType + "_products",
      searchParams,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () =>
      getPolicies(currentPage, itemsPerPage, filterType + searchParams),
    enabled: !isLoadingAuth, // Wait for auth to load
  });

  function handleAddNew() {
    router.push(`/${authType.toLowerCase()}/product/create`);
  }
  const deleteAction: any =
    isBrokerProduct || authType === "ADMIN"
      ? {
          name: "Delete",
          onClick: deletePolicy,
        }
      : {};
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterablePolicyColumns}
        />

        <Table
          name="Products"
          base="product"
          buttonName="Add New Product"
          columns={policyColumns}
          data={data?.data?.data}
          actions={[deleteAction]}
          loading={isLoading}
          addNew={
            !isLoadingAuth && (authType === "ADMIN" || isBrokerProduct) ? handleAddNew : undefined
          }
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
