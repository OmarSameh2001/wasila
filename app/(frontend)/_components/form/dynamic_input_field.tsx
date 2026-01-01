import DynamicSearchField from "./search_field";

export default function DynamicInputField({
  field,
  formState,
  handleChange,
  setFormState,
}: any) {
  switch (field.type) {
    case "checkbox":
      return (
        <textarea
          value={formState[field.key]}
          onChange={handleChange(field.key, field.type)}
          required={field.required ?? false}
        />
      );

    case "select":
      return (
        <select
          value={formState[field.key] || ""}
          onChange={handleChange(field.key, field.type)}
          required={field.required ?? false}
          className="border border-gray-300 rounded px-2 py-1 mx-5"
        >
          <option value="" className="dark:bg-black">
            -- Select an option --
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
    default:
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
