"use client";

import { useContext, useState } from "react";
import { File, Plus, Trash2, Upload } from "lucide-react";
import { HealthPricings } from "@/app/(frontend)/_dto/policy";

import * as XLSX from "xlsx";
import {
  showErrorToast,
  showLoadingError,
  showLoadingSuccess,
  showLoadingToast,
} from "../../../_utils/toaster/toaster";
import { PopupContext } from "../../../_utils/context/popup_provider";
import DynamicForm, { DynamicFormField } from "../../form/dynamic_form";

// interface HealthPricingData {
//   mainPrice?: number | null;
//   dependentPrice?: number | null;
// }

// interface HealthPricings {
//   [age: string]: HealthPricingData;
// }

interface HealthPricingProps {
  pricings: HealthPricings;
  isEditing: boolean;
  onPricingsChange: (pricings: HealthPricings) => void;
}

export default function HealthPricing({
  pricings,
  isEditing,
  onPricingsChange,
}: HealthPricingProps) {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [mainPriceText, setMainPriceText] = useState("");
  const [dependentPriceText, setDependentPriceText] = useState("");
  const [importError, setImportError] = useState("");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isNoAge, setIsNoAge] = useState(false);
  const { setComponent } = useContext(PopupContext);

  // Convert object to sorted array for display
  const sortedPricings = Object.entries(pricings)
    .map(([age, data]) => ({
      age: Number(age),
      ...data,
    }))
    .sort((a, b) => a.age - b.age);

  const handleAddPricing = () => {
    const newAge =
      sortedPricings.length > 0
        ? Math.max(...sortedPricings.map((p) => p.age)) + 1
        : 0;

    onPricingsChange({
      ...pricings,
      [newAge.toString()]: { mainPrice: 0, dependentPrice: 0 },
    });
  };

  const handleRemovePricing = (age: number) => {
    const newPricings = { ...pricings };
    delete newPricings[age.toString()];
    onPricingsChange(newPricings);
  };

  const handleUpdateAge = (oldAge: number, newAge: number) => {
    if (oldAge === newAge) return;

    const newPricings = { ...pricings };
    const data = newPricings[oldAge.toString()];
    delete newPricings[oldAge.toString()];
    newPricings[newAge.toString()] = data;
    onPricingsChange(newPricings);
  };

  const handleUpdatePrice = (
    age: number,
    field: "mainPrice" | "dependentPrice",
    value: number | null,
  ) => {
    onPricingsChange({
      ...pricings,
      [age.toString()]: {
        ...pricings[age.toString()],
        [field]: value,
      },
    });
  };

  const parseBulkText = (text: string): Map<number, number> => {
    const priceMap = new Map<number, number>();
    const lines = text.trim().split("\n");

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const age = parseInt(parts[0]);
        const priceStr = parts[1].replace(/[,\s]/g, "");

        if (!isNaN(age) && priceStr && priceStr !== "-") {
          const price = parseFloat(priceStr);
          if (!isNaN(price)) {
            priceMap.set(age, price);
          }
        }
      }
    }

    return priceMap;
  };

  const handleBulkImport = () => {
    try {
      setImportError("");

      if (!mainPriceText && !dependentPriceText) {
        setImportError("Please enter main or dependent pricing data.");
        return;
      }

      const newPricings: HealthPricings = {};
      if (isNoAge) {
        const mainLines = mainPriceText.trim().split("\n");
        const dependentLines = dependentPriceText.trim().split("\n");

        const loopLength = Math.min(
          Math.max(mainLines.length, dependentLines.length),
          100,
        );

        const parsePrice = (line: string) => {
          if (!line) return null;
          const value = parseFloat(line.replace(/[,\s]/g, ""));
          return Number.isNaN(value) ? null : value;
        };

        for (let i = 0; i < loopLength; i++) {
          const mainPrice = parsePrice(mainLines[i]);
          const dependentPrice = parsePrice(dependentLines[i]);

          if (mainPrice === null && dependentPrice === null) continue;

          newPricings[i] = {
            mainPrice,
            dependentPrice,
          };
        }
      } else {
        const mainPrices = parseBulkText(mainPriceText);
        const dependentPrices = parseBulkText(dependentPriceText);

        if (mainPrices.size === 0 && dependentPrices.size === 0) {
          setImportError(
            "No valid pricing data found. Please check the format.",
          );
          return;
        }

        const allAges = new Set([
          ...mainPrices.keys(),
          ...dependentPrices.keys(),
        ]);

        allAges.forEach((age) => {
          const mainPrice = mainPrices.get(age);
          const dependentPrice = dependentPrices.get(age);

          // Only add if at least one price exists
          if (mainPrice !== undefined || dependentPrice !== undefined) {
            newPricings[age.toString()] = {
              mainPrice: mainPrice ?? null,
              dependentPrice: dependentPrice ?? null,
            };
          }
        });
      }

      onPricingsChange(newPricings);
      setShowBulkImport(false);
      setMainPriceText("");
      setDependentPriceText("");
    } catch (error) {
      setImportError("Error parsing pricing data. Please check the format.");
    }
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
      <div className="flex flex-col items-center justify-center gap-5">
        <DynamicForm
          fields={fields}
          type="create"
          title="Upload Excel of Pricings"
          isToast={false}
          onSubmit={async (data: any) => {
            const file = data.excelFile;
            if (!file) throw new Error("No file selected");

            // Parse the file immediately
            await handleExcel(file);

            return { data: { success: true } };
          }}
        />
        

        {Object.keys(pricings ?? {}).length > 0 ? (
          <span className="text-red-700 font-bold">
            This will remove old pricings*
          </span>
        ) : null}
        
        <div className="mt-4 p-4 bg-gray-100 rounded dark:bg-gray-800 flex flex-col items-center">
          <p className="text-sm mb-2">
            If you don't have the template, download and fill it:
          </p>
          <a
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          href="https://docs.google.com/spreadsheets/d/1cZGCLmRkT8CLfBPNuiTUIOlxuV7QOVNs/export?format=xlsx"
        >
          Download Template
        </a>
        </div>
      </div>,
    );
  };

  const handleExcel = async (file: File) => {
    if (!file) return;
    setComponent(null);
    let toastId = showLoadingToast("Parsing uploaded file...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Use the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const newPricings: HealthPricings = {};

      for (const row of rows) {
        const ageStr = row["Age"];
        const mainStr = row["Employee Pricing"];
        const dependentStr = row["Dependent Pricing"];

        if (
          ageStr === undefined ||
          ageStr === "" ||
          (!mainStr && !dependentStr)
        )
          continue;

        const age = Number(ageStr);
        if (isNaN(age)) continue;

        const mainPrice =
          mainStr !== "" ? parseFloat(String(mainStr).replace(/,/g, "")) : null;
        const dependentPrice =
          dependentStr !== ""
            ? parseFloat(String(dependentStr).replace(/,/g, ""))
            : null;

        newPricings[age.toString()] = {
          mainPrice,
          dependentPrice,
        };
      }

      if (Object.keys(newPricings).length === 0) {
        showLoadingError(toastId,"No valid rows found in Excel file.");
        return;
      }

      onPricingsChange(newPricings);

      showLoadingSuccess(
        toastId,
        `File parsed successfully: ${
          Object.keys(newPricings).length
        } records added.`,
      );
      setComponent(null); // close popup
    } catch (err) {
      console.error(err);
      showLoadingError(toastId, "Failed to parse Excel file.");
    }
  };

  if (!isEditing && sortedPricings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-semibold">Health Pricing</h3>
        {isEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFileUpload}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              <File className="h-4 w-4" />
              Excel Import
            </button>
            <button
              type="button"
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              <Upload className="h-4 w-4" />
              Bulk Import
            </button>
            <button
              type="button"
              onClick={handleAddPricing}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add Pricing
            </button>
          </div>
        )}
      </div>

      {showBulkImport && isEditing && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isNoAge
                ? "Main Prices (Format: PRICE) age will itterate from 0"
                : "Main Prices (Format: AGE PRICE)"}
            </label>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm h-32"
              placeholder={`Example:\n${
                isNoAge ? "5000\n4000\n-\n8000" : "0 5000\n1 4000\n2 -\n3 8000"
              }`}
              value={mainPriceText}
              onChange={(e) => setMainPriceText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isNoAge
                ? "Dependent Prices (Format: PRICE) age will itterate from 0"
                : "Dependent Prices (Format: AGE PRICE)"}
            </label>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm h-32"
              placeholder={`Example:\n${
                isNoAge ? "5000\n4000\n-\n8000" : "0 5000\n1 4000\n2 -\n3 8000"
              }`}
              value={dependentPriceText}
              onChange={(e) => setDependentPriceText(e.target.value)}
            />
          </div>

          {importError && <p className="text-sm text-red-600">{importError}</p>}

          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleBulkImport}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Import Prices
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBulkImport(false);
                setMainPriceText("");
                setDependentPriceText("");
                setImportError("");
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isNoAge}
                onChange={(e) => setIsNoAge(e.target.checked)}
                className="cursor-pointer"
              />
              <label>No Age</label>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedPricings.map((pricing) => (
          <div key={pricing.age} className="p-4 border rounded-md space-y-2">
            {isEditing ? (
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-xs font-medium mb-1">Age</label>
                  <input
                    type="number"
                    className="border rounded p-2 w-20"
                    value={pricing.age}
                    onChange={(e) =>
                      handleUpdateAge(pricing.age, Number(e.target.value))
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium mb-1">Main Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="border rounded p-2 w-32"
                    value={pricing.mainPrice ?? ""}
                    placeholder="No price"
                    onChange={(e) =>
                      handleUpdatePrice(
                        pricing.age,
                        "mainPrice",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium mb-1">
                    Dependent Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="border rounded p-2 w-32"
                    value={pricing.dependentPrice ?? ""}
                    placeholder="No price"
                    onChange={(e) =>
                      handleUpdatePrice(
                        pricing.age,
                        "dependentPrice",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePricing(pricing.age)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex justify-between sm:w-8/12">
                <p className="text-sm font-medium">Age {pricing.age}</p>
                <p className="text-sm">
                  {pricing.mainPrice !== null && pricing.mainPrice !== undefined
                    ? `Employee: ${pricing.mainPrice.toFixed(2)}`
                    : "Employee: N/A"}
                </p>
                <p className="text-sm">
                  {pricing.dependentPrice !== null &&
                  pricing.dependentPrice !== undefined
                    ? `Dependent: ${pricing.dependentPrice.toFixed(2)}`
                    : "Dependent: N/A"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {sortedPricings.length === 0 && !showBulkImport && (
        <p className="text-sm text-gray-500 text-center py-4">
          No pricing data. Click "Add Pricing" or "Bulk Import" to add prices.
        </p>
      )}
    </div>
  );
}
