import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { PopupContext } from "../../_utils/context/popup_provider";
import { AxiosResponse } from "axios";
import DynamicInputField from "./dynamic_input_field";
import {
  showLoadingError,
  showLoadingSuccess,
  showLoadingToast,
} from "../../_utils/toaster/toaster";
import { queryInvalidator } from "../../_utils/query/query";

export type DynamicFormField<T = any> = {
  label: string;
  key: string;
  value?: T;
  validation?: RegExp;
  required?: boolean;
  choices?: string[];
  prev?: string;
  limit?: number;
  accept?: string;
  adminOnly?: boolean;
  type?:
    | "text"
    | "email"
    | "number"
    | "password"
    | "checkbox"
    | "textarea"
    | "file"
    | "select"
    | "search"
    | "image"| "contact";
};

type DynamicFormProps = {
  fields: DynamicFormField[];
  title?: string | "Add New Record";
  type?: "create" | "update";
  id?: number;
  query?: string;
  isToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSubmit:
    | ((data: any, id: number) => Promise<AxiosResponse<any, any, {}>>)
    | ((id: number, data: any) => Promise<AxiosResponse<any, any, {}>>)
    | Dispatch<SetStateAction<File | null>>;
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  title,
  type = "create",
  id,
  query,
  isToast = true,
  successMessage,
  errorMessage,
  onSubmit,
}) => {
  const initialState: Record<string, any> = {};
  fields.forEach((field) => {
    initialState[field.key] = field.value ?? (field.type === "checkbox" ? false : field.type === "contact" ? [] : "");
  });

  const [formState, setFormState] = useState<Record<string, any>>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [disabled, setDisabled] = useState(false);
  const { setComponent } = useContext(PopupContext);

  const handleChange =
    (key: string, type?: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value: any = e.target.value;
      if (type === "checkbox") value = (e.target as HTMLInputElement).checked;
      setFormState((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let toastId;
    try {
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
        setDisabled(true);
        if (type === "create") {
          console.log(formState);
          if (isToast) toastId = showLoadingToast(title || "Creating...");
          await onSubmit(formState, 0);
          if (isToast && toastId)
            showLoadingSuccess(
              toastId,
              successMessage || "Created Successfully"
            );
        } else if (type === "update") {
          if (isToast) toastId = showLoadingToast(title || "Updating...");
          await onSubmit(Number(id), formState);
          if (isToast && toastId)
            showLoadingSuccess(
              toastId,
              successMessage || "Updated Successfully"
            );
        }
      }
      setDisabled(false);
      if (query) queryInvalidator(query);
      setComponent(null);
    } catch (e: any) {
      console.log(e);
      if (toastId && isToast)
        showLoadingError(toastId, errorMessage || e.response.data.error || "Something went wrong");
      setDisabled(false);
    }
  };

  const isChanged = fields.some(
    (field) => formState[field.key] !== field.value
  );
console.log('Form state in DynamicForm:', formState);
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center relative"
    >
      <h1 className="text-2xl font-bold mb-5 underline">{title}</h1>
      {fields.map((field) => (
        <div
          key={field.key}
          // style={{ marginBottom: "1rem", alignSelf: "start" }}
          className="flex flex-col justify-center mb-3"
        >
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
          {disabled ? (
            <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/3"></div>
          ) : null}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={disabled || !isChanged}
        title={!isChanged ? "No changes made" : ""}
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
