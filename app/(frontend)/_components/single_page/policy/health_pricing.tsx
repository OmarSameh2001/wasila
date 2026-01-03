"use client";

import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";

interface HealthPricing {
  age: number;
  mainPrice?: number;
  dependentPrice?: number;
}

interface HealthPricingProps {
  pricings: HealthPricing[];
  isEditing: boolean;
  onPricingsChange: (pricings: HealthPricing[]) => void;
}

export default function HealthPricing({
  pricings,
  isEditing,
  onPricingsChange,
}: HealthPricingProps) {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [mainPriceText, setMainPriceText] = useState("");
  const [dependentPriceText, setDependentPriceText] = useState("");
  const [importError, setImportError] = useState("");

  const sortedPricings = [...pricings].sort((a, b) => a.age - b.age);

  const handleAddPricing = () => {
    const newAge = sortedPricings.length > 0 
      ? Math.max(...sortedPricings.map(p => p.age)) + 1 
      : 0;
    
    onPricingsChange([
      ...pricings,
      { age: newAge, mainPrice: 0, dependentPrice: 0 }
    ]);
  };

  const handleRemovePricing = (age: number) => {
    onPricingsChange(pricings.filter(p => p.age !== age));
  };

  const handleUpdatePricing = (age: number, field: keyof HealthPricing, value: number) => {
    onPricingsChange(
      pricings.map(p => 
        p.age === age ? { ...p, [field]: value } : p
      )
    );
  };

  const parseBulkText = (text: string): Map<number, number> => {
    const priceMap = new Map<number, number>();
    const lines = text.trim().split('\n');
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const age = parseInt(parts[0]);
        const priceStr = parts[1].replace(/[,\s-]/g, '');
        
        if (!isNaN(age) && priceStr && priceStr !== '-') {
          const price = parseFloat(priceStr);
          if (!isNaN(price)) {
            priceMap.set(age, price);
          }
        }
      }
    }
    
    return priceMap;
  };

  const handleBulkImport = () => {
    try {
      setImportError("");
      
      const mainPrices = parseBulkText(mainPriceText);
      const dependentPrices = parseBulkText(dependentPriceText);
      
      if (mainPrices.size === 0 && dependentPrices.size === 0) {
        setImportError("No valid pricing data found. Please check the format.");
        return;
      }

      const allAges = new Set([...mainPrices.keys(), ...dependentPrices.keys()]);
      const newPricings: HealthPricing[] = Array.from(allAges).map(age => ({
        age,
        mainPrice: mainPrices.get(age),
        dependentPrice: dependentPrices.get(age),
      }));

      onPricingsChange(newPricings);
      setShowBulkImport(false);
      setMainPriceText("");
      setDependentPriceText("");
    } catch (error) {
      setImportError("Error parsing pricing data. Please check the format.");
    }
  };

  if (!isEditing && pricings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-semibold">Health Pricing</h3>
        {isEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              <Upload className="h-4 w-4" />
              Bulk Import
            </button>
            <button
              type="button"
              onClick={handleAddPricing}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add Pricing
            </button>
          </div>
        )}
      </div>

      {showBulkImport && isEditing && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Main Prices (Format: AGE PRICE per line)
            </label>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm h-32"
              placeholder="18 5,186.00&#10;19 5,186.00&#10;20 5,186.00"
              value={mainPriceText}
              onChange={(e) => setMainPriceText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Dependent Prices (Format: AGE PRICE per line, use '-' for no price)
            </label>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm h-32"
              placeholder="0 4,722.00&#10;1 4,722.00&#10;16 -"
              value={dependentPriceText}
              onChange={(e) => setDependentPriceText(e.target.value)}
            />
          </div>

          {importError && (
            <p className="text-sm text-red-600">{importError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBulkImport}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Import Prices
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBulkImport(false);
                setMainPriceText("");
                setDependentPriceText("");
                setImportError("");
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedPricings.map((pricing) => (
          <div
            key={pricing.age}
            className="p-4 border rounded-md space-y-2"
          >
            {isEditing ? (
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-xs font-medium mb-1">Age</label>
                  <input
                    type="number"
                    className="border rounded p-2 w-20"
                    value={pricing.age}
                    onChange={(e) =>
                      handleUpdatePricing(pricing.age, "age", Number(e.target.value))
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium mb-1">Main Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="border rounded p-2 w-32"
                    value={pricing.mainPrice || ""}
                    placeholder="Optional"
                    onChange={(e) =>
                      handleUpdatePricing(
                        pricing.age,
                        "mainPrice",
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium mb-1">Dependent Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="border rounded p-2 w-32"
                    value={pricing.dependentPrice || ""}
                    placeholder="Optional"
                    onChange={(e) =>
                      handleUpdatePricing(
                        pricing.age,
                        "dependentPrice",
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePricing(pricing.age)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm">
                Age {pricing.age}: 
                {pricing.mainPrice !== undefined && ` Main: ${pricing.mainPrice.toFixed(2)}`}
                {pricing.dependentPrice !== undefined && ` | Dependent: ${pricing.dependentPrice.toFixed(2)}`}
              </p>
            )}
          </div>
        ))}
      </div>

      {sortedPricings.length === 0 && !showBulkImport && (
        <p className="text-sm text-gray-500 text-center py-4">
          No pricing data. Click "Add Pricing" or "Bulk Import" to add prices.
        </p>
      )}
    </div>
  );
}