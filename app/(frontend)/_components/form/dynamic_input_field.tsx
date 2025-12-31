export default function DynamicInputField({ field, formState, handleChange }: any) {
  switch (field.type) {
    case "checkbox":
      return (
        <textarea
          value={formState[field.key]}
          onChange={handleChange(field.key, field.type)}
          required={field.required ?? false}
        />
      );
    
    case 'select':
      handleChange(field.key, field.type)
      return (
        <select
          value={formState[field.key] || field?.choices?.[0]}
          onChange={handleChange(field.key, field.type)}
          required={field.required ?? false}
          className="border border-gray-300 rounded px-2 py-1 mx-5"
        >
          {field.choices?.map((choice: any) => (
            <option key={choice} value={choice} className="dark:bg-black">
              {choice}
            </option>
          ))}
        </select>
    )
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
