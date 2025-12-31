"use client";
import { useContext, useEffect, useState } from "react";
import Table from "../../_components/table/table";
import { companiesColumns, companiesList } from "../../_dto/company";
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

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["adminRecord"],
    queryFn: () => getCompanies(1, 10, ""),
  });
  
  function handleAddNew() {
    setComponent(
      <DynamicForm
        fields={[
          {
            key: "name",
            label: "Name",
            type: "text",
            // value: newCompany.name,
            required: true,
          },
          {
            key: "address",
            label: "Address",
            type: "text",
            // value: newCompany.address,
          },
          {
            key: "logo",
            label: "Logo",
            type: "text",
            // value: newCompany.logo,
          },
        ]}
        title="Add New Company"
        type="create"
        query="adminRecord"
        onSubmit={createCompany}
      />
    );
  }
  function handleUpdate(id: number, data: any) {
    console.log(data);
    setComponent(
      <DynamicForm
        fields={[
          {
            key: "name",
            label: "Name",
            type: "text",
            value: data.name,
            required: true,
          },
          {
            key: "address",
            label: "Address",
            type: "text",
            value: data.address,
          },
          {
            key: "logo",
            label: "Logo",
            type: "text",
            value: data.logo,
          },
        ]}
        title="Update Company"
        type="update"
        query="adminRecord"
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
        />
      </div>
    </div>
  );
}
