"use client";
import React, { useState } from "react";
import {
  Upload,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Users,
  Calculator,
  ShoppingCart,
} from "lucide-react";
import {
  CalculatedPolicyRecord,
  InsuredPersonData,
} from "@/app/(frontend)/_dto/record";
import { healthPolicyGroups } from "@/app/(frontend)/_dto/policy";

export default function RecordCreate() {
  const [step, setStep] = useState(1);
  const [csvText, setCsvText] = useState("");
  const [people, setPeople] = useState<InsuredPersonData[]>([]);
  const [calculatedRecords, setCalculatedRecords] = useState<
    CalculatedPolicyRecord[]
  >([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Set<number>>(
    new Set()
  );
  const [clientId, setClientId] = useState("");
  const [brokerId, setBrokerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null);
  const [issueDate, setIssueDate] = useState("");
  const [filters, setFilters] = useState({
    minInsuredPercentage: 0,
    maxInsuredPercentage: 100,
    minTotalAmount: 0,
    maxTotalAmount: Infinity,
    minTotalTaxed: 0,
    maxTotalTaxed: Infinity,
    minAverageAge: 0,
    companyName: "",
    // maxAverageAge: 100,
  });
  const [showFilters, setShowFilters] = useState(false);

  const parseCsv = () => {
    try {
      setError("");
      const lines = csvText.trim().split("\n");
      const parsed: InsuredPersonData[] = [];

      for (const line of lines) {
        const parts = line.trim().split("\t");
        if (parts.length >= 2) {
          const [birthDate, type] = parts;
          if ((type === "Employee" || type === "Dependent") && birthDate) {
            parsed.push({ birthDate, type });
          }
        }
      }

      if (parsed.length === 0) {
        setError(
          "No valid data found. Format: DATE\\tEmployee or DATE\\tDependent"
        );
        return;
      }

      setPeople(parsed);
      setStep(2);
    } catch (err) {
      setError("Error parsing CSV. Please check format.");
    }
  };

  const calculatePolicies = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const cdate = new Date();
      const idate = new Date(issueDate);
      if (
        cdate > idate &&
        !(cdate.toDateString() === idate.toDateString()) &&
        !window.confirm("Are you sure you want to create a record in the past?")
      ) {
        return;
      }
      const monthAhead = new Date(
        cdate.getFullYear(),
        cdate.getMonth() + 1,
        cdate.getDate()
      );
      if (
        idate > monthAhead &&
        !window.confirm(
          "Are you sure you want to create a record after more than a month?"
        )
      ) {
        return;
      }

      setLoading(true);
      setError("");

      const response = await fetch("/api/record/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ people, issueDate }),
      });

      if (!response.ok) throw new Error("Failed to calculate policies");

      const data = await response.json();
      setCalculatedRecords(data.calculatedRecords);
      setStep(3);
    } catch (err) {
      setError("Error calculating policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePolicy = (policyId: number) => {
    const newSelected = new Set(selectedPolicies);
    if (newSelected.has(policyId)) {
      newSelected.delete(policyId);
    } else {
      if (newSelected.size >= 6) {
        setError("Maximum 6 policies can be selected");
        return;
      }
      newSelected.add(policyId);
    }
    setSelectedPolicies(newSelected);
    setError("");
  };

  const createRecord = async () => {
    try {
      if (!clientId) {
        setError("Please enter client ID");
        return;
      }

      if (selectedPolicies.size === 0) {
        setError("Please select at least one policy");
        return;
      }

      setLoading(true);
      setError("");

      const selected = calculatedRecords.filter((r) =>
        selectedPolicies.has(r.policyId)
      );

      const response = await fetch("/api/record/create-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: parseInt(clientId),
          brokerId: 1, // Replace with actual broker ID from session
          state: "DRAFT",
          selectedPolicies: selected,
          issueDate: issueDate || new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create record");

      const record = await response.json();
      setStep(4);
    } catch (err) {
      setError("Error creating record. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const filteredRecords = calculatedRecords.filter((record) => {
    const insuredPercentage =
      (record.numberOfInsureds / record.numberOfPersons) * 100;

    return (
      insuredPercentage >= filters.minInsuredPercentage &&
      insuredPercentage <= filters.maxInsuredPercentage &&
      record.totalAmount >= filters.minTotalAmount &&
      record.totalAmount <= filters.maxTotalAmount &&
      record.totalTaxed >= filters.minTotalTaxed &&
      record.totalTaxed <= filters.maxTotalTaxed &&
      record.averageAge >= filters.minAverageAge
      && (
  filters.companyName === "" ||
  record.companyName
    .toLowerCase()
    .includes(filters.companyName.toLowerCase())
)
      // record.averageAge <= filters.maxAverageAge
    );
  });
  const resetFilters = () => {
    setFilters({
      minInsuredPercentage: 0,
      maxInsuredPercentage: 100,
      minTotalAmount: 0,
      maxTotalAmount: Infinity,
      minTotalTaxed: 0,
      maxTotalTaxed: Infinity,
      minAverageAge: 0,
      companyName: "",
      // maxAverageAge: 100,
    });
  };

  const selectedRecords = calculatedRecords.filter((r) =>
    selectedPolicies.has(r.policyId)
  );
  // const totalSelectedAmount = selectedRecords.reduce(
  //   (sum, r) => sum + r.totalAmount,
  //   0
  // );
  // const totalSelectedTaxed = selectedRecords.reduce(
  //   (sum, r) => sum + r.totalTaxed,
  //   0
  // );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between hidden sm:flex">
          {[
            { num: 1, label: "Upload Data", icon: FileSpreadsheet },
            { num: 2, label: "Review People", icon: Users },
            { num: 3, label: "Select Policies", icon: Calculator },
            { num: 4, label: "Complete", icon: Check },
          ].map(({ num, label, icon: Icon }, idx) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  // onClick={() => setStep(num)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                    step >= num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="mt-2 text-sm font-medium">{label}</span>
              </div>
              {idx < 3 && (
                <div
                  className={`h-1 flex-1 ${
                    step > num ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="mb-8 flex items-center justify-between sm:hidden">
          {[
            { num: 1, icon: FileSpreadsheet },
            { num: 2, icon: Users },
            { num: 3, icon: Calculator },
            { num: 4, icon: Check },
          ].map(({ num, icon: Icon }) => (
            <div
              // onClick={() => setStep(num)}
              key={num}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                step >= num
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Step 1: Upload CSV */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 hidden sm:block" />
              Upload Employee & Dependent Data
            </h2>
            <p className="text-gray-600 dark:text-gray-200 mb-6">
              Paste your data with birth dates and types (tab-separated)
            </p>
            <textarea
              className="w-full h-64 border-2 border-gray-300 rounded-lg p-4 font-mono text-sm"
              placeholder="1/1/1990	Employee&#10;1/1/2015	Dependent&#10;"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <button
              onClick={parseCsv}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Parse Data
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Review People */}
        {step === 2 && (
          <form
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            onSubmit={(e) => calculatePolicies(e)}
          >
            <h2 className="text-2xl font-bold mb-4">Review Parsed Data</h2>
            <div className="mb-6 flex flex-col sm:grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {people.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-200">
                  Total People
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {people.filter((p) => p.type === "Employee").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-200">
                  Employees
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {people.filter((p) => p.type === "Dependent").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-200">
                  Dependents
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-6 ml-2 flex-col sm:flex-row items-center">
              <span className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                Issue Date:
              </span>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value ?? new Date())}
                required
                className="border border-gray-200 dark:border-gray-500 w-fit"
              />
              {issueDate && (
                <div className="flex items-center flex-wrap gap-2 flex-col sm:flex-row">
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-200 ml-2">
                    {new Intl.DateTimeFormat("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }).format(new Date(issueDate))}
                  </span>
                  <span
                    className={`${
                      new Date(issueDate).toDateString() ===
                      new Date().toDateString()
                        ? "hidden"
                        : new Date(issueDate) > new Date()
                        ? "text-green-600"
                        : new Date(issueDate) < new Date()
                        ? "text-red-600"
                        : "hidden"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {Math.abs(
                      Math.round(
                        (new Date(issueDate).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    ) + 1}{" "}
                    days
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => setStep(1)}
                className="px-2 py-1 sm:px-6 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                // onClick={calculatePolicies}
                type="submit"
                disabled={loading || people.length === 0 || issueDate === ""}
                className="px-2 py-1 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
              >
                {loading ? "Calculating..." : "Calculate Policies"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Select Policies */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Filter Policies {filteredRecords.length} policies found</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
              </div>

              {showFilters && (
                <div className="space-y-4">
                  {/* Name Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company Name:
                    </label>
                    <input
                      type="text"
                      value={filters.companyName}
                      onChange={(e) =>
                        setFilters({ ...filters, companyName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter name"
                    />
                  </div>
                  {/* Insured Percentage Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Insured Percentage: {filters.minInsuredPercentage}% -{" "}
                      {filters.maxInsuredPercentage}%
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.minInsuredPercentage}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minInsuredPercentage: Number(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      {/* <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.maxInsuredPercentage}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxInsuredPercentage: Number(e.target.value),
                          })
                        }
                        className="flex-1"
                      /> */}
                    </div>
                  </div>

                  {/* Total Amount Filter */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* <div>
                      <label className="block text-sm font-medium mb-2">
                        Min Total Amount
                      </label>
                      <input
                        type="number"
                        value={filters.minTotalAmount}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minTotalAmount: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        // placeholder="0"
                      />
                    </div> */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Max Total Amount
                      </label>
                      <input
                        type="number"
                        value={
                          filters.maxTotalAmount === Infinity
                            ? ""
                            : filters.maxTotalAmount
                        }
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxTotalAmount:
                              e.target.value === ""
                                ? Infinity
                                : Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Max Total Taxed
                      </label>
                      <input
                        type="number"
                        value={
                          filters.maxTotalTaxed === Infinity
                            ? ""
                            : filters.maxTotalTaxed
                        }
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxTotalTaxed:
                              e.target.value === ""
                                ? Infinity
                                : Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="No limit"
                      />
                    </div>
                  </div>

                  {/* Total Taxed Filter */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* <div>
                      <label className="block text-sm font-medium mb-2">
                        Min Total Taxed
                      </label>
                      <input
                        type="number"
                        value={filters.minTotalTaxed}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minTotalTaxed: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        // placeholder="0"
                      />
                    </div> */}
                    
                  </div>

                  {/* Average Age Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Average Age: {filters.minAverageAge}
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.minAverageAge}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minAverageAge: Number(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      {/* <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.maxAverageAge}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxAverageAge: Number(e.target.value),
                          })
                        }
                        className="flex-1"
                      /> */}
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Reset Filters
                    </button>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      Showing {filteredRecords.length} of{" "}
                      {calculatedRecords.length} policies
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Select Policies (1-6)</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedPolicies.size} of 6 policies selected •{" "}
                {filteredRecords.length} policies visible
              </p>
            </div>

            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const isSelected = selectedPolicies.has(record.policyId);
                const isExpanded = expandedPolicy === record.policyId;

                return (
                  <div
                    key={record.policyId}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 ${
                      isSelected ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    <div className="p-2 sm:p-6">
                      <div className="flex items-start gap-4 justify-between">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePolicy(record.policyId)}
                            className="mt-1 w-5 h-5"
                          />
                          <img
                            src={record.companyLogo || ""}
                            alt={record.companyName}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">
                              {record.policyName}
                            </h3>
                            <p className="text-gray-600">
                              {record.companyName}
                            </p>
                            <div className="mt-4 flex flex-col items-center md:grid md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-200">
                                  Insured:
                                </span>
                                <span className="ml-2 font-bold">
                                  {record.numberOfInsureds}/
                                  {record.numberOfPersons}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-200">
                                  Avg Age:
                                </span>
                                <span className="ml-2 font-bold">
                                  {record.averageAge.toFixed(1)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-200">
                                  Avg/Person:
                                </span>
                                <span className="ml-2 font-bold">
                                  {record.avgPricePerPerson.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-200">
                                  Total:
                                </span>
                                <span className="ml-2 font-bold">
                                  {record.totalAmount.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-200">
                                  Total Taxed:
                                </span>
                                <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">
                                  {record.totalTaxed.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedPolicy(
                              isExpanded ? null : record.policyId
                            )
                          }
                          className="p-1 sm:px-4 sm:py-2 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          {isExpanded ? "Hide" : "View"} Details
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t space-y-6">
                          {/* Policy Coverage Details */}
                          <div>
                            <h4 className="font-semibold mb-3 text-lg">
                              Coverage Details:
                            </h4>
                            <div className="space-y-6">
                              {Object.entries(healthPolicyGroups).map(
                                ([groupName, fields]) => (
                                  <div key={groupName}>
                                    <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 pb-1 border-b">
                                      {groupName}
                                    </h5>
                                    <div className="flex flex-wrap w-full gap-3">
                                      {fields
                                        .filter(
                                          (key) =>
                                            record.policy[
                                              key as keyof typeof record.policy
                                            ] !== undefined
                                        )
                                        .map((key) => {
                                          const value =
                                            record.policy[
                                              key as keyof typeof record.policy
                                            ];
                                          const isNotCovered =
                                            typeof value === "string"
                                              ? value.toLowerCase() ===
                                                "not covered"
                                              : false;
                                          const label = key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (str) =>
                                              str.toUpperCase()
                                            )
                                            .trim();

                                          return (
                                            <div
                                              key={key}
                                              className={`p-3 rounded-lg border-2 max-w-2/12 w-full min-w-max ${
                                                !isNotCovered
                                                  ? "bg-green-50 dark:bg-green-900/30 border-green-500"
                                                  : "bg-gray-50 dark:bg-gray-700 border-gray-300"
                                              }`}
                                            >
                                              <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs sm:text-sm font-medium">
                                                  {label}
                                                </span>
                                                <span
                                                  className={`text-xs font-bold px-2 py-1 rounded ${
                                                    !isNotCovered
                                                      ? "bg-green-600 text-white"
                                                      : "bg-gray-400 text-white"
                                                  }`}
                                                >
                                                  {!isNotCovered
                                                    ? typeof value ===
                                                        "string" ||
                                                      typeof value === "number"
                                                      ? value
                                                      : "✓"
                                                    : "—"}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Insured People */}
                          <div>
                            <h4 className="font-semibold mb-3 text-lg">
                              Insured People:
                            </h4>
                            <div className="max-h-64 overflow-y-auto space-y-1">
                              {record.insuredPeople.map((person, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center justify-between flex-col sm:flex-row text-sm p-2 rounded ${
                                    person.isInsured
                                      ? "bg-green-50 dark:bg-green-900"
                                      : "bg-red-50 dark:bg-red-900"
                                  }`}
                                >
                                  <span>
                                    {person.type} - Age {person.age}
                                  </span>
                                  {person.isInsured ? (
                                    <span className="text-green-700 dark:text-green-100 font-medium">
                                      {person.price.toFixed(2)} EGP
                                    </span>
                                  ) : (
                                    <span className="text-red-700 dark:text-red-100 text-xs">
                                      {person.reason}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-6">
              <label className="block mb-2 font-medium">Client ID</label>
              <input
                type="number"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter client ID"
              />
              <label className="block my-2 font-medium">Broker ID</label>
              <input
                type="number"
                value={brokerId}
                onChange={(e) => setBrokerId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter broker ID"
              />
              <div className="mt-6 flex sm:flex-row flex-col gap-4">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to go back it will delete the calculated records?"
                      )
                    )
                      setStep(2);
                  }}
                  className="px-2 py-1 sm:px-6 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={createRecord}
                  disabled={loading || selectedPolicies.size === 0}
                  className="px-2 py-1 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create Record"}
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Record Created Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your policy record with {selectedPolicies.size} policies has been
              created.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setCsvText("");
                setPeople([]);
                setCalculatedRecords([]);
                setSelectedPolicies(new Set());
                setClientId("");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Another Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
