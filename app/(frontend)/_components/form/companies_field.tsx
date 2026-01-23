"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useCallback, useEffect } from "react";
import { searchCompany } from "../../_services/company";
import { X } from "lucide-react";

export default function MultiCompanySelect({
  field,
  formState,
  setFormState,
  disabled = false,
  initialCompanies = [],
}: {
  field: any;
  formState: any;
  setFormState: (state: any) => void;
  disabled?: boolean;
  initialCompanies?: any[];
}) {
  const [search, setSearch] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const delay = 1000;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize selected companies from initialCompanies prop
  useEffect(() => {
    if (initialCompanies && initialCompanies.length > 0) {
      const companies = initialCompanies.map((c: any) => ({
        id: c.companyId,
        name: c.company.name,
        logo: c.company.logo,
      }));
      setSelectedCompanies(companies);
    }
  }, [initialCompanies]);

  const { data, isLoading } = useQuery({
    queryKey: ["searchCompany", search],
    queryFn: async () => {
      if (search) {
        return searchCompany(`name_contains=${search}`);
      }
      return null;
    },
    enabled: search.length > 0 && isOpen,
  });

  const debouncedSetSearch = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      setSearch(value);
      setIsTyping(false);
    }, delay);
  }, []);

  const handleDebouncedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSetSearch(value);
      setIsOpen(value.length > 0);
    },
    [debouncedSetSearch]
  );

  const handleSelectCompany = (company: any) => {
    // Check if already selected
    if (selectedCompanies.find((c) => c.id === company.id)) {
      return;
    }

    const newSelectedCompanies = [...selectedCompanies, company];
    setSelectedCompanies(newSelectedCompanies);
    
    // Update form state with company IDs
    const companyIds = newSelectedCompanies.map((c) => c.id);
    setFormState((prev: any) => ({
      ...prev,
      [field.key]: companyIds,
    }));

    setInputValue("");
    setSearch("");
    setIsOpen(false);
  };

  const handleRemoveCompany = (companyId: number) => {
    const newSelectedCompanies = selectedCompanies.filter(
      (c) => c.id !== companyId
    );
    setSelectedCompanies(newSelectedCompanies);
    
    // Update form state with company IDs
    const companyIds = newSelectedCompanies.map((c) => c.id);
    setFormState((prev: any) => ({
      ...prev,
      [field.key]: companyIds,
    }));
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const choices = data?.data?.data || [];

  return (
    <div className="w-full space-y-3">
      {/* Selected Companies */}
      {selectedCompanies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              {company.logo && (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-sm text-gray-900 dark:text-white">
                {company.name}
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveCompany(company.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      {!disabled && (
        <div className="relative">
          <input
            className="py-2.5 sm:py-3 ps-4 pe-9 block w-full bg-gray-100 border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            value={inputValue}
            onChange={handleDebouncedChange}
            placeholder="Search insurers..."
            onFocus={() => inputValue.length > 0 && setIsOpen(true)}
            disabled={disabled}
          />

          <div
            className="absolute top-1/2 end-3 -translate-y-1/2 cursor-pointer"
            onClick={handleToggle}
          >
            <svg
              className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7 15 5 5 5-5"></path>
              <path d="m7 9 5-5 5 5"></path>
            </svg>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700 mt-1">
              {isTyping || isLoading ? (
                <div className="py-2 px-4 w-full text-sm text-gray-800 dark:text-neutral-200 text-center cursor-progress">
                  Loading
                  <span className="inline-flex ml-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce [animation-delay:0.15s]">
                      .
                    </span>
                    <span className="animate-bounce [animation-delay:0.3s]">
                      .
                    </span>
                  </span>
                </div>
              ) : choices.length > 0 ? (
                choices.map((company: any, index: number) => {
                  const isSelected = selectedCompanies.find(
                    (c) => c.id === company.id
                  );
                  return (
                    <div
                      key={company.id || index}
                      className={`cursor-pointer py-2 px-4 w-full text-sm rounded-lg focus:outline-none ${
                        isSelected
                          ? "bg-blue-100 dark:bg-blue-900/30 text-gray-800 dark:text-neutral-200"
                          : "text-gray-800 hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200"
                      }`}
                      role="option"
                      tabIndex={index}
                      onClick={() => handleSelectCompany(company)}
                    >
                      <div className="flex gap-x-2 items-center w-full">
                        {company.logo && (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span>{company.name}</span>
                        {isSelected && (
                          <span className="ml-auto">
                            <svg
                              className="shrink-0 size-3.5 text-blue-600 dark:text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-2 px-4 w-full text-sm text-gray-800 dark:text-neutral-200 text-center">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selectedCompanies.length === 0 && disabled && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No companies selected
        </p>
      )}
    </div>
  );
}