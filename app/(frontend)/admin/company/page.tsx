"use client";
import { useContext, useState } from "react";
import Table from "../../_components/table/table";
import { companiesColumns, editableCompanyColumns } from "../../_dto/company";
import { PopupContext } from "../../_components/utils/context/popup_provider";
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

export default function AdminCompany() {
  const { setComponent } = useContext(PopupContext);
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["adminCompanies", searchParams, currentPage, itemsPerPage],
    queryFn: () => getCompanies(currentPage, itemsPerPage, searchParams),
  });

  function handleAddNew() {
    setComponent(
      <DynamicForm
        fields={editableCompanyColumns}
        title="Add New Company"
        type="create"
        query="adminCompanies"
        onSubmit={createCompany}
      />
    );
  }
  function handleUpdate(id: number, data: any) {
    console.log(data);
    setComponent(
      <DynamicForm
        fields={editableCompanyColumns.map((column) => ({
          ...column,
          value: data[column.key],
        }))}
        title="Update Company"
        type="update"
        query="adminCompanies"
        id={id}
        onSubmit={updateCompany}
      />
    );
  }
  return (
    <div className="">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterableCompanyColumns}
        />
        <Table
          name="Companies"
          columns={companiesColumns}
          data={data?.data?.data}
          actions={[
            { name: "Edit", onClick: handleUpdate },
            { name: "Delete", onClick: deleteCompany },
          ]}
          loading={isLoading}
          addNew={handleAddNew}
          query="adminCompanies"
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
