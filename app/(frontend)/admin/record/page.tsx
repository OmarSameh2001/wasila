"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { recordsColumns, recordsList } from "../../_dto/record";
import { getRecords } from "../../_services/record";
import { PopupContext } from "../../_components/utils/context/popup_provider";
import { useContext, useState } from "react";
import DynamicForm from "../../_components/form/dynamic_form";

export default function AdminRecord() {
  const { setComponent, setIsOpen } = useContext(PopupContext);
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    logo: "",
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["adminRecord"],
    queryFn: () => getRecords(1, 10, ""),
  });
  console.log(data);

  function handleAddNew() {
    setComponent(
      <>
        <DynamicForm
          fields={[
            {
              key: "name",
              label: "Name",
              type: "text",
              setter: (val) => setNewCompany({ ...newCompany, name: val }),
              value: newCompany.name,
            },
            {
              key: "address",
              label: "Address",
              type: "text",
              setter: (val) => setNewCompany({ ...newCompany, address: val }),
              value: newCompany.address,
            },
            {
              key: "logo",
              label: "Logo",
              type: "file",
              setter: (val) => setNewCompany({ ...newCompany, logo: val }),
              value: newCompany.logo,
            },
          ]}
          onSubmit={() => {}}
        />
      </>
    );
  }
  return (
    <div className="">
      <div className="p-5">
        <Table
          name="Records"
          columns={recordsColumns}
          data={data?.data ?? []}
          actions={[]}
          loading={isLoading}
          addNew={handleAddNew}
        />
      </div>
    </div>
  );
}
