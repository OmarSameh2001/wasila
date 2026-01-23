import { Plus, X } from "lucide-react";

type SocialMediaEntry = {
  platform: string;
  url: string;
};

const PLATFORM_OPTIONS = [
  "facebook",
  "x.com",
  "linkedin",
  "instagram",
  "youtube",
  "tiktok",
  "other",
];

export default function SocialMediaField({
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
  // Convert the socialMedia object to an array for easier manipulation
  const socialMediaObj = formState[field.key] || {};
  const socialMediaEntries: SocialMediaEntry[] = Object.entries(socialMediaObj).map(
    ([platform, url]) => ({
      platform,
      url: url as string,
    })
  );

  const addSocialMedia = () => {
    if (socialMediaEntries.length >= 8) return;

    // Find the first unused platform
    const usedPlatforms = socialMediaEntries.map((entry) => entry.platform);
    const availablePlatform =
      PLATFORM_OPTIONS.find((p) => !usedPlatforms.includes(p)) || "other";

    const newEntry = { platform: availablePlatform, url: "" };
    const newEntries = [...socialMediaEntries, newEntry];

    // Convert back to object - include empty URLs so fields appear
    const newObj = newEntries.reduce((acc, entry) => {
      acc[entry.platform] = entry.url;
      return acc;
    }, {} as Record<string, string>);

    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newObj,
    }));
  };

  const removeSocialMedia = (index: number) => {
    const newEntries = socialMediaEntries.filter((_, i) => i !== index);

    // Convert back to object - include all remaining entries
    const newObj = newEntries.reduce((acc, entry) => {
      acc[entry.platform] = entry.url;
      return acc;
    }, {} as Record<string, string>);

    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newObj,
    }));
  };

  const updatePlatform = (index: number, platform: string) => {
    const newEntries = [...socialMediaEntries];
    newEntries[index] = { ...newEntries[index], platform };

    // Convert back to object - include all entries
    const newObj = newEntries.reduce((acc, entry) => {
      acc[entry.platform] = entry.url;
      return acc;
    }, {} as Record<string, string>);

    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newObj,
    }));
  };

  const updateUrl = (index: number, url: string) => {
    const newEntries = [...socialMediaEntries];
    newEntries[index] = { ...newEntries[index], url };

    // Convert back to object - include all entries
    const newObj = newEntries.reduce((acc, entry) => {
      acc[entry.platform] = entry.url;
      return acc;
    }, {} as Record<string, string>);

    setFormState((prev: any) => ({
      ...prev,
      [field.key]: newObj,
    }));
  };

  return (
    <div className="space-y-3 w-full">
      {socialMediaEntries.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <select
            id={`${field.key}-platform-${index}`}
            name={`${field.key}-platform-${index}`}
            value={entry.platform}
            onChange={(e) => updatePlatform(index, e.target.value)}
            disabled={disabled}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-black dark:text-white capitalize"
          >
            {PLATFORM_OPTIONS.map((platform) => (
              <option key={platform} value={platform} className="capitalize">
                {platform}
              </option>
            ))}
          </select>

          <input
            id={`${field.key}-url-${index}`}
            name={`${field.key}-url-${index}`}
            type="url"
            value={entry.url}
            onChange={(e) => updateUrl(index, e.target.value)}
            placeholder="Enter profile URL"
            disabled={disabled}
            required
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1 bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeSocialMedia(index);
            }}
            disabled={disabled}
            className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Remove social media"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}

      {socialMediaEntries.length < 8 && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addSocialMedia();
          }}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Social Media{" "}
          {socialMediaEntries.length > 0 && `(${socialMediaEntries.length}/8)`}
        </button>
      )}

      {socialMediaEntries.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No social media links added yet
        </p>
      )}
    </div>
  );
}