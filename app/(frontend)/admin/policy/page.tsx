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
import { useRouter } from "next/navigation";

export default function AdminPolicy() {
  const { setComponent } = useContext(PopupContext);
  const router = useRouter()

  const { isLoading, data } = useQuery({
    queryKey: ["adminPolicies"],
    queryFn: () => getPolicies(1, 10, ""),
  });

  function handleAddNew() {
    // setComponent(
    //   <DynamicForm
    //     fields={editablePolicyColumns}
    //     title="Add New Policy"
    //     type="create"
    //     query="adminPolicies"
    //     onSubmit={createPolicy}
    //   />
    // );
    router.push('/admin/policy/create')
  }
  
  function handleUpdate(id: number, data: any) {
    
    setComponent(
      <DynamicForm
        fields={editablePolicyColumns.map((column) => {
          const getNestedValue = (obj: any, path: string) => {
            return path.split('.').reduce((current, key) => current?.[key], obj);
          };

          return {
            ...column,
            value: data[column.key],
            ...(column.prev ? { prev: getNestedValue(data, column.prev) } : {}),
          };
        })}
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
