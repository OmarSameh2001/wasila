"use client";
import { useContext } from "react";
import Table from "../../_components/table/table";
import {
  editablePolicyColumns,
  policiesList,
  policyColumns,
} from "../../_dto/policy";
import {
  createPolicy,
  deletePolicy,
  getPolicies,
  updatePolicy,
} from "../../_services/policy";
import { PopupContext } from "../../_components/utils/context/popup_provider";
import DynamicForm from "../../_components/form/dynamic_form";
import { useQuery } from "@tanstack/react-query";

export default function AdminPolicy() {
  const { setComponent } = useContext(PopupContext);

  const { isLoading, data } = useQuery({
    queryKey: ["adminPolicies"],
    queryFn: () => getPolicies(1, 10, ""),
  });

  function handleAddNew() {
    setComponent(
      <DynamicForm
        fields={editablePolicyColumns}
        title="Add New Policy"
        type="create"
        query="adminPolicies"
        onSubmit={createPolicy}
      />
    );
  }
  function handleUpdate(id: number, data: any) {
    console.log(data);
    setComponent(
      <DynamicForm
        fields={editablePolicyColumns.map((column) => ({
          ...column,
          value: data[column.key],
        }))}
        title="Update Policy"
        type="update"
        query="adminPolicies"
        id={id}
        onSubmit={updatePolicy}
      />
    );
  }
  return (
    <div className="">
      <div className="p-5">
        <Table
          name="Policies"
          columns={policyColumns}
          data={data?.data?.data}
          actions={[
            { name: "edit", onClick: handleUpdate },
            { name: "delete", onClick: deletePolicy },
          ]}
          loading={isLoading}
          addNew={handleAddNew}
          query="adminPolicies"
        />
      </div>
    </div>
  );
}
