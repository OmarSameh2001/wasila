"use client";
import { useQuery } from "@tanstack/react-query";
import Table from "../../_components/table/table";
import { clientsColumns, editableClientColumns } from "../../_dto/user";
import { getClients, getUsers } from "../../_services/user";
import { useContext, useState } from "react";
import DynamicFilter from "../../_components/fliter/filter_bar";
import { filterableCLientColumns } from "../../_dto/general";
import { PopupContext } from "../../_utils/context/popup_provider";
import DynamicForm from "../../_components/form/dynamic_form";
import { createClient } from "@/app/(frontend)/_services/user";

export default function AdminClients() {
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { setComponent } = useContext(PopupContext);

  const { isLoading, data } = useQuery({
    queryKey: ["clients", searchParams, currentPage, itemsPerPage],
    queryFn: () => getClients(currentPage, itemsPerPage, searchParams),
  });
  return (
    <div className="">
      <div className="p-5">
        <DynamicFilter
          onSearch={setSearchParams}
          fields={filterableCLientColumns}
        />

        <Table
          name="Clients"
          base="client"
          columns={clientsColumns}
          data={data?.data.users ?? []}
          actions={[]}
          addNew={() =>
            setComponent(
              <DynamicForm
                fields={editableClientColumns}
                title="Add New Client"
                type="create"
                onSubmit={createClient}
                query="clients"
              />
            )
          }
          loading={isLoading}
          query="clients"
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
