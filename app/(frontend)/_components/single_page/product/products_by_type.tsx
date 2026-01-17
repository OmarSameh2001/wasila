"use client";
import { useContext, useMemo, useState } from "react";
import { policyColumns } from "../../../_dto/policy";
import { getPolicies } from "../../../_services/policy";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { filterablePolicyColumns } from "../../../_dto/general";
import DynamicFilter from "../../fliter/filter_bar";
import Table from "../../table/table";
import { AuthContext } from "../../utils/context/auth";

export default function ProductsByType({ type }: { type: string }) {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { isLoading: isLoadingAuth, type: authType, id: authId } = useContext(AuthContext);
  const pathname = usePathname();

  const filterType = useMemo(() => {
    let filter = type === "sme" ? "type=SME&" : "type=Individual_Medical&";

    if (pathname.includes("/broker/wasila-products")) {
      filter += "brokerId=null&";
    } else if (pathname.includes("/broker/product") && authType === "BROKER" && authId) {
      filter += `brokerId=${authId}&`;
    }

    return filter;
  }, [type, pathname, authType, isLoadingAuth]);
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
    router.push("/admin/product/create");
  }

  return (
    <div className="">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterablePolicyColumns}
        />

        <Table
          name="Products"
          buttonName="Add New Product"
          columns={policyColumns}
          data={data?.data?.data}
          actions={[]}
          loading={isLoading}
          addNew={
            !isLoadingAuth && authType === "ADMIN" ? handleAddNew : undefined
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
