"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { getClient } from "../../../_services/user";
import { getRecords } from "../../../_services/record";
import { recordsColumns } from "../../../_dto/record";
import { filterableRecordColumns } from "../../../_dto/general";
import Table from "../../table/table";
import { useState } from "react";
import DynamicFilter from "../../fliter/filter_bar";
import Link from "next/link";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params?.id as string;
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pathname = usePathname();
  console.log(pathname);

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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const client = clientData?.data?.user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Client Details
          </h1>

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
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.contactInfo || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Client Count
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {client?.clientCount || 0}
              </p>
            </div>

            <div>
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
            </div>

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
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Client Records
          </h2>

          <DynamicFilter
            onSearch={setSearchParams}
            fields={filterableRecordColumns.filter((col) => col.key !== "clientId")}
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
