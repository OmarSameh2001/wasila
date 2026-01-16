import { useRef, useState } from "react";
import DynamicSearchField from "./search_field";
import { DynamicFormField } from "./dynamic_form";

export default function DynamicInputField({
  field,
  formState,
  handleChange,
  setFormState,
  disabled = false,
}: {
  field: DynamicFormField;
  formState: any;
  handleChange: any;
  setFormState: (state: any) => void;
  disabled?: boolean;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  switch (field.type) {
    case "checkbox":
      return (
        <textarea
          value={formState[field.key]}
          onChange={handleChange(field.key, field.type)}
          required={field.required ?? false}
          disabled={disabled}
        />
      );

    case "select":
      return (
        <select
          value={formState?.[field.key] ?? ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          required={field.required ?? false}
          className="border border-dark dark:border-gray-300 rounded px-2 py-1 w-fit"
          disabled={disabled}
        >
          <option value="" className="dark:bg-black">
            *None*
          </option>
          {field.choices?.map((choice: any) => (
            <option key={choice} value={choice} className="dark:bg-black">
              {choice}
            </option>
          ))}
        </select>
      );
    case "search":
      return (
        <DynamicSearchField
          field={field}
          formState={formState}
          handleChange={handleChange}
        />
      );
    case "image":
      // const imageInputRef = useRef<HTMLInputElement>(null);
      // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
      const existingImageUrl = field.value; // The existing image URL from database

      return (
        <div className="space-y-3">
          {/* Existing Image Display */}
          {existingImageUrl && !previewUrl && (
            <div className="relative inline-block">
              <img
                src={existingImageUrl}
                alt="Current logo"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
              />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Current
              </span>
            </div>
          )}

          {/* New Image Preview */}
          {previewUrl && (
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="New logo preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-green-500 shadow-sm"
              />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            </div>
          )}

          {/* File Input Area */}
          <div className="flex items-center gap-3">
            <label
              htmlFor={`file-${field.key}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium"
            >
              {existingImageUrl || previewUrl ? "Change Image" : "Upload Image"}
            </label>
            <input
              id={`file-${field.key}`}
              ref={imageInputRef}
              type="file"
              accept={field.accept || "image/*"}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (field.limit && file.size > field.limit) {
                  alert(
                    `File size should be less than ${(
                      field.limit / 1_000_000
                    ).toFixed(1)}MB`
                  );
                  imageInputRef.current!.value = "";
                  setPreviewUrl(null);
                  return;
                }

                const url = URL.createObjectURL(file);
                setPreviewUrl(url);

                setFormState((prev: any) => ({
                  ...prev,
                  [field.key]: file,
                }));
              }}
              disabled={disabled}
            />

            {/* Clear New Image Button */}
            {previewUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  imageInputRef.current!.value = "";
                  setPreviewUrl(null);
                  setFormState((prev: any) => ({
                    ...prev,
                    [field.key]: existingImageUrl || null,
                  }));
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>

          {/* File Info */}
          {field.limit && (
            <p className="text-xs text-gray-500">
              Max size: {(field.limit / 1_000_000).toFixed(1)}MB • Formats: JPG,
              PNG, GIF
            </p>
          )}
        </div>
      );
    case "file":

      return (
        <div className="flex flex-col items-center justify-center">
          <input
            ref={fileInput}
            type="file"
            accept={field.accept || ""}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormState((prev: any) => ({
                  ...prev,
                  [field.key]: file,
                }));
              }
            }}
            required={field.required ?? false}
            className="border border-gray-300 rounded px-2 py-1 mx-5 cursor-pointer w-fit"
            disabled={disabled}
          />
          {formState[field.key] && (
            <p className="text-sm text-gray-600 mx-5">
              Selected: {formState[field.key].name}
            </p>
          )}
        </div>
      );
    default:
      return null;
      return (
        <input
          type={field.type || "text"}
          checked={field.type === "checkbox" ? formState[field.key] : undefined}
          value={field.type === "checkbox" ? undefined : formState[field.key]}
          onChange={handleChange(field.key, field.type)}
          required={field.required ?? false}
          placeholder={field.label}
          className="border border-gray-300 rounded px-2 py-1 mx-5"
        />
      );
  }
}
