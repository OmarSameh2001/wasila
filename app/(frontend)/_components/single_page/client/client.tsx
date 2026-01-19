"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { getClient, updateClient } from "../../../_services/user";
import { getRecords } from "../../../_services/record";
import { recordsColumns } from "../../../_dto/record";
import { filterableRecordColumns } from "../../../_dto/general";
import Table from "../../table/table";
import { useContext, useState } from "react";
import DynamicFilter from "../../fliter/filter_bar";
import Link from "next/link";
import LoadingPage from "@/app/(frontend)/_utils/promise_handler/loading/loading";
import { PopupContext } from "@/app/(frontend)/_utils/context/popup_provider";
import DynamicForm from "../../form/dynamic_form";
import { editableClientColumns } from "@/app/(frontend)/_dto/user";
import { Edit, Plus } from "lucide-react";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params?.id as string;
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { setComponent } = useContext(PopupContext);
  const pathname = usePathname();

  const { isLoading: isLoadingClient, data: clientData } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(Number(clientId)),
    enabled: !!clientId,
  });

  const { isLoading: isLoadingRecords, data: recordsData } = useQuery({
    queryKey: [
      "client_records",
      clientId,
      searchParams,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () =>
      getRecords(
        currentPage,
        itemsPerPage,
        `clientId=${clientId}&${searchParams}`,
      ),
    enabled: !!clientId,
  });

  if (isLoadingClient) {
    return <LoadingPage />;
  }

  const client = clientData?.data?.user;
  console.log(client);
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Client Details
            </h1>
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-900 transition-colors cursor-pointer text-black dark:text-white flex items-center gap-2"
              onClick={() => {
                setComponent(
                  <DynamicForm
                    fields={editableClientColumns.map((column) => ({
                      ...column,
                      value: client[column.key],
                    }))}
                    title="Edit Client"
                    type="update"
                    id={Number(clientId)}
                    onSubmit={updateClient}
                    query="client"
                  />,
                );
              }}
            >
              <Edit className="w-5 h-5" /> Edit Client
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Name
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.name || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Username
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.username || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.email || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Contact Info
              </label>
              {client?.contactInfo?.length > 0 ? (
                client?.contactInfo?.map((info: any, index: number) => (
                  <p
                    key={index}
                    className="text-lg text-gray-900 dark:text-gray-100"
                  >
                    {info.value}
                  </p>
                ))
              ) : (
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {"N/A"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Client Count
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.clientCount || 0}
              </p>
            </div>

            {client?.broker?.name ? <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Broker
              </label>
              <Link
                href={
                  pathname.split("/")[1] === "admin"
                    ? `/admin/broker/${client?.broker?.id}`
                    : `#`
                }
                className="text-lg text-gray-900 dark:text-gray-100 hover:underline"
              >
                {client?.broker?.name || "N/A"}
              </Link>
            </div> : null}

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Joined
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.createdAt
                  ? new Date(client.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Lead Source
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.leadSource
                  ? client?.leadSource
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Client Records
          </h2>

          <DynamicFilter
            onSearch={setSearchParams}
            fields={filterableRecordColumns.filter(
              (col) => col.key !== "clientId",
            )}
          />

          <Table
            name="Qoutes"
            base="crm"
            columns={recordsColumns.filter((col) => col.key !== "client")}
            data={recordsData?.data?.data}
            actions={[]}
            loading={isLoadingRecords}
            query="records"
            pagination={{
              currentPage,
              setCurrentPage,
              totalPages: recordsData?.data?.totalPages || 1,
              hasNextPage: recordsData?.data?.hasNextPage || false,
              itemsPerPage,
              setItemsPerPage,
            }}
          />
        </div>
      </div>
    </div>
  );
}
