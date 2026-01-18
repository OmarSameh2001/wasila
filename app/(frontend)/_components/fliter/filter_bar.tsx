"use client";
import { useContext, useState } from "react";
import { FilterableField } from "../../_dto/general";
import DynamicSearchField from "../form/search_field";
import { AuthContext } from "../../_utils/context/auth";

interface FilterValues {
  [key: string]: {
    operator: string;
    value: string;
  };
}

interface DynamicFilterProps {
  fields: FilterableField[];
  onSearch: (searchParams: string) => void;
}

// Get operators based on field type
const getOperatorsForType = (type: string) => {
  switch (type) {
    case "text":
      return [{ value: "contains", label: "Contains" }];
    case "number":
      return [
        { value: "eq", label: "=" },
        { value: "gt", label: "great" },
        { value: "gte", label: "great or =" },
        { value: "lt", label: "less" },
        { value: "lte", label: "less or =" },
      ];
    case "date":
      return [
        { value: "eq", label: "On" },
        { value: "gt", label: "After" },
        { value: "gte", label: "On or after" },
        { value: "lt", label: "Before" },
        { value: "lte", label: "On or before" },
      ];
    case "select":
    case "boolean":
    case "search":
      return [{ value: "eq", label: "=" }];
    default:
      return [{ value: "eq", label: "=" }];
  }
};

export default function DynamicFilter({
  fields,
  onSearch,
}: DynamicFilterProps) {
  const [filters, setFilters] = useState<FilterValues>(() => {
    const initial: FilterValues = {};
    fields.forEach((field) => {
      const operators = getOperatorsForType(field.type);
      initial[field.key] = { operator: operators[0]?.value || "eq", value: "" };
    });
    return initial;
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const { type } = useContext(AuthContext);

  const handleFilterChange = (
    fieldKey: string,
    key: "operator" | "value",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        [key]: value,
      },
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([fieldKey, { operator, value }]) => {
      if (value) {
        const key = operator === "eq" ? fieldKey : `${fieldKey}_${operator}`;
        params.append(key, value);
      }
    });

    onSearch(params.toString());
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {};
    fields.forEach((field) => {
      const operators = getOperatorsForType(field.type);
      resetFilters[field.key] = {
        operator: operators[0]?.value || "eq",
        value: "",
      };
    });
    setFilters(resetFilters);
    onSearch("");
    // setIsExpanded(false);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (f) => f.value
  ).length;

  const renderValueInput = (field: FilterableField) => {
    const filter = filters[field.key];

    // For search fields (foreign keys)
    if (field.searchType === "search") {
      return (
        <DynamicSearchField
          field={{
            key: field.key,
            label: field.searchLabel || field.label,
            type: "search",
            required: false,
          }}
          formState={{ [field.key]: filter.value }}
          handleChange={(key: string, value: any) => {
            handleFilterChange(field.key, "value", value?.toString() || "");
          }}
        />
      );
    }

    // For select fields
    if (field.type === "select") {
      return (
        <select
          value={filter.value}
          onChange={(e) =>
            handleFilterChange(field.key, "value", e.target.value)
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
        >
          <option value="">All</option>
          {field.choices?.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      );
    }

    // For boolean fields
    if (field.type === "boolean") {
      return (
        <select
          value={filter.value}
          onChange={(e) =>
            handleFilterChange(field.key, "value", e.target.value)
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    // For date fields
    if (field.type === "date") {
      return (
        <input
          type="date"
          value={filter.value}
          onChange={(e) =>
            handleFilterChange(field.key, "value", e.target.value)
          }
          className="w-full px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
        />
      );
    }

    // For number fields
    if (field.type === "number" || field.type === "id") {
      return (
        <input
          type="number"
          value={filter.value}
          onChange={(e) =>
            handleFilterChange(field.key, "value", e.target.value)
          }
          placeholder="Value"
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
        />
      );
    }

    // Default text input (contains only)
    return (
      <input
        type="text"
        value={filter.value}
        onChange={(e) => handleFilterChange(field.key, "value", e.target.value)}
        placeholder="Search..."
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
      />
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 mb-4">
      {/* Header */}
      <div
        className={
          "flex items-center justify-between p-3 flex-col xs:flex-row gap-2" +
          (isExpanded
            ? " border-b border-gray-200 dark:border-neutral-700"
            : "")
        }
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-2 xs:flex-row flex-col">
          <button
            type="button"
            onClick={handleSearch}
            disabled={activeFiltersCount === 0}
            className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Apply
          </button>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-sm font-medium bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Fields */}
      <div
        className={`
     transition-all duration-300 ease-in
    ${isExpanded ? "p-4" : "opacity-0 max-h-0 pointer-events-none"}
  `}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {fields.map((field) => {
            const operators = getOperatorsForType(field.type);
            const showOperator = operators.length > 1;

            return (
              <div
                key={field.key}
                className={
                  "space-y-1" +
                  (field.adminOnly && type !== "ADMIN" ? " hidden" : "")
                }
              >
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>
                <div className="flex gap-1">
                  {showOperator && (
                    <select
                      value={filters[field.key].operator}
                      onChange={(e) =>
                        handleFilterChange(
                          field.key,
                          "operator",
                          e.target.value
                        )
                      }
                      className="w-16 px-1.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="flex-1">{renderValueInput(field)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
