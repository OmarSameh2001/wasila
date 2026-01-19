"use client";
import { useContext, useState } from "react";
import Table from "../../_components/table/table";
import { companiesColumns, editableCompanyColumns } from "../../_dto/company";
import { PopupContext } from "../../_utils/context/popup_provider";
import { useQuery } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../../_services/company";
import DynamicForm from "../../_components/form/dynamic_form";
import { filterableCompanyColumns } from "../../_dto/general";
import DynamicFilter from "../../_components/fliter/filter_bar";

export default function AdminInsurers() {
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["insurers", searchParams, currentPage, itemsPerPage],
    queryFn: () => getCompanies(currentPage, itemsPerPage, searchParams),
  });

  return (
    <div className="">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterableCompanyColumns}
        />
        <Table
          name="Insurers"
          base="insurer"
          columns={companiesColumns}
          data={data?.data?.data}
          actions={[
          ]}
          loading={isLoading}
          query="insurers"
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
