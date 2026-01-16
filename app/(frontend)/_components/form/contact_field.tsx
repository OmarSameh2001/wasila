import { Plus, X } from "lucide-react";

type Contact = {
  type: "mobile" | "landline";
  value: string;
};

export default function ContactInputField({
  field,
  formState,
  setFormState,
  disabled = false,
}: {
  field: any;
  formState: any;
  setFormState: (state: any) => void;
  disabled?: boolean;
}) {
  // Initialize contacts from formState or empty array - make it reactive
  const contacts: Contact[] = Array.isArray(formState[field.key])
    ? formState[field.key]
    : [];

  const addContact = () => {
    if (contacts.length >= 5) return;

    const newContacts = [...contacts, { type: "mobile" as const, value: "" }];

    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newContacts,
    }));
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newContacts,
    }));
  };

  const updateContactType = (index: number, type: "mobile" | "landline") => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], type };

    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newContacts,
    }));
  };

  const updateContactValue = (index: number, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], value };

    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newContacts,
    }));
  };

  return (
    <div className="space-y-3 w-full">
      {contacts.map((contact, index) => (
        <div key={index} className="flex items-center gap-2">
          <select
            id={`${field.key}-type-${index}`}
            name={`${field.key}-type-${index}`}
            value={contact.type}
            onChange={(e) =>
              updateContactType(index, e.target.value as "mobile" | "landline")
            }
            disabled={disabled}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="mobile">Mobile</option>
            <option value="landline">Landline</option>
          </select>

          <input
            id={`${field.key}-value-${index}`}
            name={`${field.key}-value-${index}`}
            type="tel"
            value={contact.value}
            onChange={(e) => updateContactValue(index, e.target.value)}
            placeholder="Enter phone number"
            disabled={disabled}
            required
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1 bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeContact(index);
            }}
            disabled={disabled}
            className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Remove contact"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}

      {contacts.length < 5 && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addContact();
          }}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Contact {contacts.length > 0 && `(${contacts.length}/5)`}
        </button>
      )}

      {contacts.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No contacts added yet
        </p>
      )}
    </div>
  );
}
