import React, { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import { PopupContext } from "../utils/context/popup_provider";
import { AxiosResponse } from "axios";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import DynamicInputField from "./dynamic_input_field";

export type DynamicFormField<T = any> = {
  label: string;
  key: string;
  value?: T;
  validation?: RegExp;
  required?: boolean;
  choices?: string[];
  prev?: string;
  limit?: number;
  type?:
    | "text"
    | "email"
    | "number"
    | "password"
    | "checkbox"
    | "textarea"
    | "file"
    | "select"
    | "search"|
    "image";
};

type DynamicFormProps = {
  fields: DynamicFormField[];
  title?: string | "Add New Record";
  type?: "create" | "update";
  id?: number;
  query?: string;
  onSubmit: ((data: any, id: number) => Promise<AxiosResponse<any, any, {}>>) | ((id: number, data: any) => Promise<AxiosResponse<any, any, {}>>);
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  title,
  type = "create",
  id,
  query,
  onSubmit,
}) => {
  // Initialize state
  const initialState: Record<string, any> = {};
  fields.forEach((field) => {
    initialState[field.key] =
      field.value ?? (field.type === "checkbox" ? false : "");
  });

  const [formState, setFormState] = useState<Record<string, any>>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {setComponent} = useContext(PopupContext);
  const queryClient = useQueryClient();
  useEffect(() => {
    console.log(formState);
  }, [formState]);
  const handleChange = 
    (key: string, type?: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value: any = e.target.value;
      if (type === "checkbox") value = (e.target as HTMLInputElement).checked;
      setFormState((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try{
    let valid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.validation && !field.validation.test(formState[field.key])) {
        valid = false;
        newErrors[field.key] = `Invalid ${field.label}`;
      }
    });

    setErrors(newErrors);
    if (valid && onSubmit) {
      if (type === "create") {
        console.log(formState);
        await onSubmit(formState, 0);
      }else if(type === "update") {
        await onSubmit(Number(id), formState);
      }
    }
    if(query) queryClient.invalidateQueries([query] as InvalidateQueryFilters<readonly unknown[]>);
    setComponent(null)
  }catch(e){
    console.log(e)
  }
  };
  console.log(fields);
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center"
    >
      <h1 className="text-2xl font-bold mb-5 underline">{title}</h1>
      {fields.map((field) => (
        <div key={field.key} style={{ marginBottom: "1rem", alignSelf: "start" }}>
          <label>
            {field.required && <span style={{ color: "red" }}>*</span>}
            {`${field.label}: ${field.prev ?? ""}`}
            <DynamicInputField
              field={field}
              formState={formState}
              handleChange={handleChange}
              setFormState={setFormState}
            />
          </label>
          {errors[field.key] && (
            <span style={{ color: "red" }}>{errors[field.key]}</span>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
