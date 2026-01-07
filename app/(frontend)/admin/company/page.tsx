"use client";
import { useContext, useEffect, useState } from "react";
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

export default function AdminCompany() {
  const { setComponent } = useContext(PopupContext);

  const { isLoading, data } = useQuery({
    queryKey: ["adminCompanies"],
    queryFn: () => getCompanies(1, 10, ""),
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
