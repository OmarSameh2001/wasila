"use client";
import React, { useContext, useEffect, useState } from "react";
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
  File,
  Grid2x2Plus,
  FileUser,
  Trash2,
  Plus,
} from "lucide-react";
import {
  CalculatedPolicyRecord,
  InsuredPersonData,
} from "@/app/(frontend)/_dto/record";
import { healthPolicyGroups } from "@/app/(frontend)/_dto/policy";
import {
  calculateIndividualRecords,
  calculateSmeRecords,
} from "@/app/(frontend)/_services/record";
import { PopupContext } from "../../../_utils/context/popup_provider";
import * as XLSX from "xlsx";
import {
  showLoadingError,
  showLoadingSuccess,
  showLoadingToast,
} from "../../../_utils/toaster/toaster";
import DynamicSearchField from "../../form/search_field";
import DynamicForm, { DynamicFormField } from "../../form/dynamic_form";
import { createClient } from "@/app/(frontend)/_services/user";
import { editableClientColumns } from "@/app/(frontend)/_dto/user";
import { AuthContext } from "../../../_utils/context/auth";

export default function QuoteCreate() {
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
  const [client, setClient] = useState("");
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
  const [type, setType] = useState<string | null>(null);
  const [family, setFamily] = useState<{
    main: string;
    spouse: string[];
    children: string[];
  }>({ main: "", spouse: [], children: [] });
  const {isLoading: isLoadingAuth, type: authType, id: authId} = useContext(AuthContext);

  const { setComponent } = useContext(PopupContext);

  const parseSme = () => {
    try {
      setError("");
      const lines = csvText.trim().split("\n");
      const parsed: InsuredPersonData[] = [];

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const [birthDate, type] = parts;
          if (
            (type.toLowerCase() === "employee" ||
              type.toLowerCase() === "dependent") &&
            birthDate
          ) {
            const newType =
              parts[1].toLowerCase() === "employee" ? "Employee" : "Dependent";
            parsed.push({ birthDate, type: newType });
          }
        }
      }

      if (parsed.length === 0) {
        setError(
          "No valid data found. Format: DATE\\tEmployee or DATE\\tDependent"
        );
        return;
      }
      if (parsed.length > 250) {
        setError(
          "Maximum 250 people allowed. Please reduce the number of people."
        );
        return;
      }

      setPeople(parsed);
      setStep(3);
    } catch (err) {
      setError("Error parsing CSV. Please check format.");
    }
  };

  const isFutureDate = (date: Date) => date > new Date();

  const getAge = (dob: Date, today = new Date()) => {
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const parseFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    let toastId;
    try {
      const today = new Date();
      const mainDOB = new Date(family.main);

      // Main member
      if (isFutureDate(mainDOB)) {
        setError("Main member's date of birth should be in the past.");
        return;
      }

      if (getAge(mainDOB, today) < 18) {
        setError("Main member should be at least 18 years old");
        return;
      }

      // Spouse
      if (family.spouse?.length > 0) {
        const spouseDates = family.spouse.map((d) => new Date(d));

        if (spouseDates.some(isFutureDate)) {
          setError("The spouse's date of birth should be in the past.");
          return;
        }

        if (
          spouseDates.some((d) => getAge(d, today) < 18) &&
          !window.confirm("Are you sure a spouse is under 18?")
        ) {
          return;
        }
      }

      // Children
      if (family.children?.length > 0) {
        const childDates = family.children.map((d) => new Date(d));
        console.log(childDates);
        if (childDates.some(isFutureDate)) {
          setError("The child's date of birth should be in the past.");
          return;
        }
        console.log(
          childDates.some((d) => d > mainDOB),
          mainDOB,
          childDates[0]
        );
        if (childDates.some((d) => getAge(mainDOB, d) < 16)) {
          setError(
            "The child should be at least 16 years younger than the main member."
          );
          return;
        }
      }

      toastId = showLoadingToast("Calculating Family plans...");

      const response = await calculateIndividualRecords({
        family,
        issueDate,
      });

      const data = response.data;

      setCalculatedRecords(data.calculatedRecords);
      if (toastId) showLoadingSuccess(toastId, "Family plans calculated.");
      setStep(4);
    } catch (err) {
      if (toastId) showLoadingError(toastId, "Error calculating family plans.");
      setError("Error parsing Family. Please check date format.");
    }
  };

  const calculatePolicies = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      setLoading(true);
      setError("");

      const response = calculateSmeRecords({
        people,
        issueDate,
      });

      const data = (await response).data;
      setCalculatedRecords(data.calculatedRecords);
      setStep(4);
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
        setError("Please choose client");
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

      const effectiveBrokerId = isLoadingAuth && authType === "BROKER" ? authId : null;
      const response = await fetch(type === "Individual_Medical" ? "/api/record/create-bulk/individual" : "/api/record/create-bulk/sme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: clientId,//parseInt(clientId)
          brokerId: effectiveBrokerId,
          state: "DRAFT",
          selectedPolicies: selected,
          issueDate: issueDate || new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create record");

      const record = await response.json();
      setStep(5);
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
      record.averageAge >= filters.minAverageAge &&
      (filters.companyName === "" ||
        record.companyName
          .toLowerCase()
          .includes(filters.companyName.toLowerCase()))
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
  const handleFileUpload = () => {
    const fields: DynamicFormField[] = [
      {
        label: "Upload Excel File",
        key: "excelFile",
        type: "file",
        required: true,
        accept: ".xlsx,.xls",
        limit: 1,
      },
    ];

    setComponent(
      <div className="flex flex-col gap-4">
        <DynamicForm
          fields={fields}
          title="Upload Excel of Employees and Dependents"
          isToast={false}
          onSubmit={async (data: any) => {
            const file = data.excelFile;
            if (!file) throw new Error("No file selected");

            // Parse the file immediately
            await parseExcelFile(file);

            return { data: { success: true } };
          }}
        />

        {/* Template download link below the form */}
        <div className="mt-4 p-4 bg-gray-100 rounded dark:bg-gray-800 flex flex-col items-center">
          <p className="text-sm mb-2">
            If you don't have the template, download and fill it:
          </p>
          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1UrHqf1Sd3TQGPF7pHKkKDWgbeVwPfCc3/edit?usp=sharing&ouid=108291203033422402688&rtpof=true&sd=true"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Download template
          </a>
        </div>
      </div>
    );
  };

  // Extract the Excel parsing logic into a separate function
  const parseExcelFile = async (file: File) => {
    let toastId;
    try {
      setError("");
      toastId = showLoadingToast("Parsing Excel file...");
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        raw: false,
      });

      const lines: string[] = [];

      for (const row of rows) {
        const birthDate = row["Date Of Birth"] || null;
        const type = row["Type"] || null;

        if (!birthDate || !type) continue;

        const normalizedType = type.toString().toLowerCase();
        if (normalizedType !== "employee" && normalizedType !== "dependent")
          continue;

        lines.push(`${birthDate}\t${type}`);
      }

      if (lines.length === 0) {
        showLoadingError(toastId, "No valid rows found in Excel file.");
        throw new Error("No valid rows found in Excel file.");
      }

      if (lines.length > 250) {
        showLoadingError(toastId, "Maximum 250 people allowed.");
        throw new Error("Maximum 250 people allowed.");
      }

      setCsvText((prev) => prev + "\n" + lines.join("\n"));
      showLoadingSuccess(
        toastId,
        `Excel file parsed successfully.\n${lines.length} records added.`
      );
      return lines.length;
    } catch (err) {
      if (toastId) showLoadingError(toastId, "Error parsing Excel file.");
      console.error(err);
      throw err;
    }
  };

  const handleClientValue = (value: any) => {
    setClient({ ...value, clientId: value.id, id: null });
    setClientId(value.id);
  };
  const handleBrokerValue = (key: string, value: string) => {
    setBrokerId(value);
    console.log(value);
  };

  const handleQouteInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

      setStep(2);
    } catch (e) {
      console.log(e);
    }
  };
  const selectedRecords = calculatedRecords.filter((r) =>
    selectedPolicies.has(r.policyId)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between hidden sm:flex">
          {[
            { num: 1, label: "Quote Info", icon: FileUser },
            { num: 2, label: "Upload Data", icon: Grid2x2Plus },
            { num: 3, label: "Review People", icon: Users },
            { num: 4, label: "Select Plans", icon: Calculator },
            { num: 5, label: "Complete", icon: Check },
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
              {idx < 4 && (
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
            { num: 1, icon: FileUser },
            { num: 2, icon: Grid2x2Plus },
            { num: 3, icon: Users },
            { num: 4, icon: Calculator },
            { num: 5, icon: Check },
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

        {/* Step 1: Quote Info */}
        {step === 1 && (
          <form
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            onSubmit={(e) => handleQouteInfo(e)}
          >
            <h1 className="text-2xl font-bold mb-6 underline">Qoute Info:</h1>
            <div className="flex gap-4 mb-6 ml-2 flex-col sm:flex-row items-center">
              <label className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                Client:
              </label>
              <DynamicSearchField
                field={{
                  key: "clientId",
                  label: authType === "ADMIN"?"User":"Client",
                  type: "search",
                  required: true,
                  prev: "name",
                }}
                formState={client}
                handleChange={() => {}}
                handleUi={handleClientValue}
              />
              Or
              <button
                type="button"
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-900 transition-colors cursor-pointer text-black dark:text-white flex items-center gap-2"
                onClick={() => {
                  setComponent(
                    <DynamicForm
                      fields={editableClientColumns}
                      title="Add New Client"
                      type="create"
                      onSubmit={createClient}
                    />
                  );
                }}
              >
                <Plus className="w-5 h-5" /> Add Client
              </button>
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
                className="w-fit px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#141d2c]"
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
            <div className="flex gap-4 mb-6 ml-2 flex-col sm:flex-row items-center">
              <label className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                Plan Type:
              </label>
              <select
                value={type ?? ""}
                onChange={(e) => setType(e.target.value)}
                required
                className="border border-dark dark:border-gray-300 bg-white dark:bg-[#141d2c] rounded px-2 py-1 w-fit"
              >
                <option value="" className="dark:bg-black">
                  *None*
                </option>
                <option value={"Individual_Medical"} className="dark:bg-black">
                  Individual Medical
                </option>
                <option value={"SME"} className="dark:bg-black">
                  SME
                </option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
              Next
            </button>
          </form>
        )}
        {/* Step 2: Upload CSV */}
        {step === 2 &&
          (type === "SME" ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6 hidden sm:block" />
                Upload Employee & Dependent Data
              </h2>
              <p className="text-gray-600 dark:text-gray-200 mb-6">
                Paste your data with birth dates and types Ex: (mm/dd/yyyy TYPE)
              </p>
              <p className="text-gray-600 dark:text-gray-200 mb-6">
                Or you can upload an excel file{" "}
                <button
                  type="button"
                  onClick={handleFileUpload}
                  className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-400 cursor-pointer"
                >
                  <File className="h-4 w-4" />
                  Excel Import
                </button>
              </p>
              <textarea
                className="w-full h-64 border-2 border-gray-300 rounded-lg p-4 font-mono text-sm"
                placeholder="1/1/1990	Employee&#10;1/1/2015	Dependent&#10;"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={parseSme}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Parse Data
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <form className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8" onSubmit={(e) => parseFamily(e)}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Upload className="w-6 h-6 hidden sm:block" />
                  Upload Individual & Family
                </h2>

                {/* Main Individual */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Main Individual
                  </h3>
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={family.main}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFamily({ ...family, main: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#141d2c]"
                    />
                  </div>
                </div>

                {/* Spouses */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Spouses</h3>
                    {family.spouse.length < 4 && (
                      <button
                        onClick={() =>
                          setFamily({
                            ...family,
                            spouse: [...family.spouse, ""],
                          })
                        }
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Spouse
                      </button>
                    )}
                  </div>
                  {family.spouse.map((dob, index) => (
                    <div key={index} className="flex gap-2 mb-3 max-w-xs">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={dob}
                          required
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            const updated = [...family.spouse];
                            updated[index] = e.target.value;
                            setFamily({ ...family, spouse: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#141d2c]"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() =>
                            setFamily({
                              ...family,
                              spouse: family.spouse.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Children */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Children</h3>
                    {family.children.length < 10 && (
                      <button
                        onClick={() =>
                          setFamily({
                            ...family,
                            children: [...family.children, ""],
                          })
                        }
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Child
                      </button>
                    )}
                  </div>
                  {family.children.map((dob, index) => (
                    <div key={index} className="flex gap-2 mb-3 max-w-xs">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={dob}
                          required
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            const updated = [...family.children];
                            updated[index] = e.target.value;
                            setFamily({ ...family, children: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#141d2c]"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() =>
                            setFamily({
                              ...family,
                              children: family.children.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    type="button"
                    className="mt-4 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    // onClick={parseFamily}
                    type="submit"
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    Parse Data
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          ))}

        {/* Step 3: Review People */}
        {step === 3 && (
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

            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => setStep(2)}
                className="px-2 py-1 sm:px-6 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                // onClick={calculatePolicies}
                type="submit"
                disabled={loading || people.length === 0}
                className="px-2 py-1 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
              >
                {loading ? "Calculating..." : "Calculate Policies"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Select Policies */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">
                  Filter Policies {filteredRecords.length} policies found
                </h3>
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
              {/* <label className="block my-2 font-medium">Broker</label>
              <DynamicSearchField
                field={{
                  key: "brokerId",
                  label: "Broker",
                  type: "search",
                  required: true,
                  // prev: "company.name",
                }}
                formState={{ brokerId }}
                handleChange={handleBrokerValue}
              /> */}
              {/* <input
                type="number"
                value={brokerId}
                onChange={(e) => setBrokerId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter broker ID"
              /> */}
              <div className="mt-6 flex sm:flex-row flex-col gap-4">
                <button
                  onClick={() => {
                    if (filteredRecords.length <= 0 ||
                      window.confirm(
                        "Are you sure you want to go back it will delete the calculated records?"
                      )
                    )
                      if(type === "SME") setStep(3); else setStep(2);
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

        {/* Step 5: Success */}
        {step === 5 && (
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
                setBrokerId("");
                setClient("");
                setType("");
                setIssueDate("");
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
