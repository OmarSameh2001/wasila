"use client";
import { getRecord, updateRecord } from "@/app/(frontend)/_services/record";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  User,
  Briefcase,
  Calendar,
  Building2,
  Users,
  Calculator,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { queryInvalidator } from "../../utils/query/query";
import LoadingPage from "../../utils/promise_handler/loading/loading";

interface RecordPolicy {
  recordId: number;
  policyId: number;
  totalAmount: string;
  totalTaxed: string;
  policyDescription: string;
  numberOfInsureds: number;
  numberOfPersons: number;
  averageAge: string;
  avgPricePerPerson: string;
}

interface RecordData {
  id: number;
  state: string;
  clientId: number;
  brokerId: number;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    name: string;
  };
  broker: {
    id: number;
    name: string;
  };
  policies: RecordPolicy[];
}

export default function SingleRecordView({ id }: { id: string }) {
  let { isLoading, isError, data, error } = useQuery({
    queryKey: ["adminRecord", id],
    queryFn: () => getRecord(Number(id)),
  });
  const record = (data?.data as RecordData) || null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "WON":
        return "bg-green-100 text-green-800 border-green-300";
      case "LOST":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  async function handleUpdateRecord(newRecord: any) {
    try {
      isLoading = true;
      await updateRecord(record?.id as number, newRecord);
      isLoading = false;
      queryInvalidator("adminRecord");
    } catch (err) {
      isLoading = false;
      record.state = data?.data?.state;
      console.log(err);
    }
  }

  if (isLoading || !record) return <LoadingPage />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 sm:p-8 p-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6 min-w-fit">
          <div className="flex items-start justify-between sm:flex-row flex-col">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Record #{record.id}
                </h1>
                <p className="text-gray-600 mt-1 dark:text-gray-300">
                  Created {formatDate(record.createdAt)}
                </p>
              </div>
            </div>
            <select
              className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStateColor(
                record.state
              )} cursor-pointer bg-white`}
              value={record.state}
              onChange={(e) => {
                handleUpdateRecord({
                  state: e.target.value,
                });
              }}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="WON">WON</option>
              <option value="LOST">LOST</option>
            </select>
          </div>
        </div>

        {/* Client & Broker Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Client
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Name:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {record.client.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Client ID:
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  #{record.client.id}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Broker
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Name:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {record.broker.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Broker ID:
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  #{record.broker.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Important Dates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  Issue Date
                </span>
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-500">
                {formatDate(record.issueDate)}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  Created
                </span>
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-500">
                {formatDate(record.createdAt)}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  Last Updated
                </span>
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-500">
                {formatDate(record.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Policies ({record.policies.length})
            </h2>
          </div>

          <div className="space-y-4">
            {record.policies.map((policy, index) => (
              <div
                key={policy.policyId}
                className="border-2 border-gray-200 dark:border-gray-500 rounded-lg p-6 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-100 rounded-full text-sm font-semibold">
                        Policy #{policy.policyId}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                      {policy.policyDescription}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-200">
                        Insured
                      </span>
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-500">
                      {policy.numberOfInsureds}/{policy.numberOfPersons}
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-200">
                        Avg Age
                      </span>
                    </div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-500">
                      {policy.averageAge}
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calculator className="w-4 h-4 text-green-600 dark:text-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-200">
                        Avg/Person
                      </span>
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-500">
                      {formatCurrency(policy.avgPricePerPerson)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center flex-wrap">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-200">
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-500">
                        {formatCurrency(policy.totalAmount)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-200">
                        Total with Tax:
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-500">
                        {formatCurrency(policy.totalTaxed)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
