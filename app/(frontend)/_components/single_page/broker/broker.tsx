"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getBroker } from "../../../_services/user";
import { getRecords } from "../../../_services/record";
import { getPolicies } from "../../../_services/policy";
import { recordsColumns } from "../../../_dto/record";
import { policyColumns } from "../../../_dto/policy";
import { filterableRecordColumns, filterablePolicyColumns } from "../../../_dto/general";
import Table from "../../table/table";
import { useState } from "react";
import DynamicFilter from "../../fliter/filter_bar";

export default function BrokerDetailPage() {
  const params = useParams();
  const brokerId = params?.id as string;
  
  const [recordSearchParams, setRecordSearchParams] = useState("");
  const [recordCurrentPage, setRecordCurrentPage] = useState(1);
  const [recordItemsPerPage, setRecordItemsPerPage] = useState(10);

  const [policySearchParams, setPolicySearchParams] = useState("");
  const [policyCurrentPage, setPolicyCurrentPage] = useState(1);
  const [policyItemsPerPage, setPolicyItemsPerPage] = useState(10);

  const { isLoading: isLoadingBroker, data: brokerData } = useQuery({
    queryKey: ["broker", brokerId],
    queryFn: () => getBroker(Number(brokerId)),
    enabled: !!brokerId,
  });

  const { isLoading: isLoadingRecords, data: recordsData } = useQuery({
    queryKey: ["broker_records", brokerId, recordSearchParams, recordCurrentPage, recordItemsPerPage],
    queryFn: () =>
      getRecords(recordCurrentPage, recordItemsPerPage, `brokerId=${brokerId}&${recordSearchParams}`),
    enabled: !!brokerId,
  });

  const { isLoading: isLoadingPolicies, data: policiesData } = useQuery({
    queryKey: ["broker_policies", brokerId, policySearchParams, policyCurrentPage, policyItemsPerPage],
    queryFn: () =>
      getPolicies(policyCurrentPage, policyItemsPerPage, `brokerId=${brokerId}&${policySearchParams}`),
    enabled: !!brokerId,
  });

  if (isLoadingBroker) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const broker = brokerData?.data?.data;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Broker Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Name
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {broker?.name || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Username
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {broker?.username || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {broker?.email || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Date of Birth
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {broker?.dob
                  ? new Date(broker.dob).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Contact Info
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {broker?.contactInfo?.map((info: any) => info.value).join(", ") || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Managed Count
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {broker?.managedCount || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Joined
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {broker?.createdAt
                  ? new Date(broker.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Broker Records
          </h2>
          
          <DynamicFilter
            onSearch={setRecordSearchParams}
            fields={filterableRecordColumns}
          />

          <Table
            name="Quotes"
            base="crm"
            columns={recordsColumns}
            data={recordsData?.data?.data}
            actions={[]}
            loading={isLoadingRecords}
            query="records"
            pagination={{
              currentPage: recordCurrentPage,
              setCurrentPage: setRecordCurrentPage,
              totalPages: recordsData?.data?.totalPages || 1,
              hasNextPage: recordsData?.data?.hasNextPage || false,
              itemsPerPage: recordItemsPerPage,
              setItemsPerPage: setRecordItemsPerPage,
            }}
          />
        </div>

        {/* Policies Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Policies Created
          </h2>
          
          <DynamicFilter
            onSearch={setPolicySearchParams}
            fields={filterablePolicyColumns}
          />

          <Table
            name="Policies"
            base="policy"
            columns={policyColumns}
            data={policiesData?.data?.data}
            actions={[]}
            loading={isLoadingPolicies}
            query="policies"
            pagination={{
              currentPage: policyCurrentPage,
              setCurrentPage: setPolicyCurrentPage,
              totalPages: policiesData?.data?.totalPages || 1,
              hasNextPage: policiesData?.data?.hasNextPage || false,
              itemsPerPage: policyItemsPerPage,
              setItemsPerPage: setPolicyItemsPerPage,
            }}
          />
        </div>
      </div>
    </div>
  );
}