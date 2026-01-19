"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCompany } from "../../../_services/company";
import { getPolicies } from "../../../_services/policy";
import { policyColumns } from "../../../_dto/policy";
import { filterablePolicyColumns } from "../../../_dto/general";
import Table from "../../table/table";
import { useState } from "react";
import DynamicFilter from "../../fliter/filter_bar";
import LoadingPage from "@/app/(frontend)/_utils/promise_handler/loading/loading";

export default function InsurerDetailPage() {
  const params = useParams();
  const companyId = params?.id as string;
  const [searchParams, setSearchParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading: isLoadingCompany, data: companyData } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(Number(companyId)),
    enabled: !!companyId,
  });

  const { isLoading: isLoadingPolicies, data: policiesData } = useQuery({
    queryKey: [
      "company_policies",
      companyId,
      searchParams,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () =>
      getPolicies(
        currentPage,
        itemsPerPage,
        `companyId=${companyId}&${searchParams}`,
      ),
    enabled: !!companyId,
  });

  if (isLoadingCompany) {
    return (
      <LoadingPage />
    );
  }

  const company = companyData?.data;
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Insurer Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            {company?.logo && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Logo
                </label>
                <div className="shrink-0 flex items-center">
                  <img
                    className="w-15 h-15 rounded object-cover"
                    src={company.logo}
                    alt={`${company.name} logo`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Company Name
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {company?.name || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Address
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                {company?.address || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Policies Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {company?.name?.toUpperCase() || "Insurer"} Policies
          </h2>

          <DynamicFilter
            onSearch={setSearchParams}
            fields={filterablePolicyColumns.filter(
              (field) => field.key !== "companyId",
            )}
          />

          <Table
            name="Products"
            base="product"
            columns={policyColumns.filter((col) => col.key !== "company")}
            data={policiesData?.data?.data}
            actions={[]}
            loading={isLoadingPolicies}
            query="policies"
            pagination={{
              currentPage,
              setCurrentPage,
              totalPages: policiesData?.data?.totalPages || 1,
              hasNextPage: policiesData?.data?.hasNextPage || false,
              itemsPerPage,
              setItemsPerPage,
            }}
          />
        </div>
      </div>
    </div>
  );
}
