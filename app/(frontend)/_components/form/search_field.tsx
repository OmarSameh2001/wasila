"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useCallback } from "react";
import { searchCompany } from "../../_services/company";
import { searchBroker, searchClient, searchUser } from "../../_services/user";
import { searchPolicy } from "../../_services/policy";
import { DynamicFormField } from "./dynamic_form";

const getFunction = async (name: string) => {
  switch (name) {
    case "Company":
      return searchCompany;
    case "AdminClient":
      return searchUser;
    case "Client":
      return searchClient;
    case "Broker":
      return searchBroker;
    case "Policy":
      return searchPolicy;
    default:
      return null;
  }
};

export default function DynamicSearchField({ 
  field, 
  formState, 
  handleChange 
}: { 
  field: DynamicFormField; 
  formState: any; 
  handleChange: any 
}) {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const delay = 1000;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data } = useQuery({
    queryKey: ["search" + field.label, search, field.label],
    queryFn: async () => {
      const fn = await getFunction(field.label);
      if (fn && search) {
        return fn(`name_contains=${search}`);
      }
      return null;
    },
    enabled: search.length > 0,
  });

  const debouncedSetSearch = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, delay);
  }, []);

  const handleDebouncedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSetSearch(value);
      setIsOpen(value.length > 0);
    },
    [debouncedSetSearch]
  );

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setSearch("");
    setIsOpen(false);
    
    // Create a synthetic event with the item's ID as the value
    const syntheticEvent = {
      target: { value: item.id }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(field.key, field.type)(syntheticEvent);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setSearch("");
    setIsOpen(false);
    
    // Create a synthetic event with empty value
    const syntheticEvent = {
      target: { value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(field.key, field.type)(syntheticEvent);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  const choices = data?.data?.data || [];
  console.log(isOpen)
  return (
    <div className="relative">
      <div className="relative">
        <input
          className="py-2.5 sm:py-3 ps-4 pe-9 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          value={selectedItem ? selectedItem.name : search}
          onChange={handleDebouncedChange}
          placeholder="Search..."
          onFocus={() => !selectedItem && search.length > 0 && setIsOpen(true)}
        />
        
        {(search || selectedItem) && (
          <div className="absolute inset-y-0 end-8 flex items-center z-20">
            <button
              type="button"
              className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
              aria-label="Close"
              onClick={handleClear}
            >
              <span className="sr-only">Close</span>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
            </button>
          </div>
        )}
        
        <div className="absolute top-1/2 end-3 -translate-y-1/2 cursor-pointer" onClick={handleToggle}>
          <svg className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 15 5 5 5-5"></path>
            <path d="m7 9 5-5 5 5"></path>
          </svg>
        </div>
      </div>
      
      {isOpen && choices.length > 0 && (
        <div className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700 mt-1">
          {choices.map((item: any, index: number) => (
            <div
              key={item.id || index}
              className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
              role="option"
              tabIndex={index}
              onClick={() => handleSelectItem(item)}
            >
              <div className="flex justify-between items-center w-full">
                <span>{item.name}</span>
                {formState[field.key] === item.id && (
                  <span>
                    <svg className="shrink-0 size-3.5 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}