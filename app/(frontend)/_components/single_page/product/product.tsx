"use client";

import { useEffect, useState } from "react";
import { FilePlus, Pencil, Save, X } from "lucide-react";
import type { HealthPolicy } from "@/app/(frontend)/_dto/policy";
import { createPolicy, updatePolicy } from "@/app/(frontend)/_services/policy";
import { useParams, useRouter } from "next/navigation";
import DynamicSearchField from "../../form/search_field";
import DynamicInputField from "../../form/dynamic_input_field";
import HealthPricing from "./health_pricing";
import LoadingPage from "../../utils/promise_handler/loading/loading";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import {
  showLoadingError,
  showLoadingSuccess,
  showLoadingToast,
} from "../../utils/toaster/toaster";

export default function SingleProductEditable({
  policy,
  isLoading,
}: {
  policy: HealthPolicy;
  isLoading: boolean;
}) {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(id === "create");
  const [editedPolicy, setEditedPolicy] = useState<HealthPolicy>(policy || {});
  const [isCompanySearch, setIsCompanySearch] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const isCreate = !(
    typeof policy === "object" &&
    Object.keys(policy).length > 0 &&
    id !== "create"
  );

  const handleCancel = () => {
    setEditedPolicy(policy);
    setIsEditing(false);
    setIsCompanySearch(false);
  };

  const handleSave = async (e: any) => {
    let toastId;
    try {
      e.preventDefault();
      if (!editedPolicy.companyId) window.alert("Please select a company");
      if (isCreate) {
        toastId = showLoadingToast("Creating Policy...");
        await createPolicy(editedPolicy);
        showLoadingSuccess(toastId, "Policy Created Successfully");
      } else {
        toastId = showLoadingToast("Updating Policy...");
        await updatePolicy(editedPolicy.id, editedPolicy);
        showLoadingSuccess(toastId, "Policy Updated Successfully");
      }

      queryClient.invalidateQueries(["products"] as InvalidateQueryFilters<
        readonly unknown[]
      >);
      // router.push("/admin/policy");
    } catch (e) {
      if (toastId) showLoadingError(toastId, "Something went wrong");
      console.log(e);
    }
  };

  const updatePolicyField = (field: string, value: any) => {
    console.log(field, value);
    console.log(editedPolicy);
    setEditedPolicy({
      ...editedPolicy,
      [field]: value,
    });
  };

  const updateHealthPolicy = (field: string, value: any) => {
    setEditedPolicy((prev) => ({
      ...prev,
      healthPolicy: {
        ...prev?.healthPolicy,
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    setEditedPolicy(policy);
  }, [policy, id]);
  useEffect(() => {
    if (editedPolicy?.type === "Individual_Medical") {
      setEditedPolicy({
        ...editedPolicy,
        healthPolicy: {
          ...editedPolicy?.healthPolicy,
          lifeInsurance: "Not Covered",
        },
      });
    }
  }, [editedPolicy?.type]);

  if (isLoading) return <LoadingPage />;
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl min-w-[80vw]">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold text-foreground mb-2">
            {isCreate ? "Create New Plan" : "Edit Plan"}
          </h1>
          <p className="text-muted-foreground">
            Manage medical insurance plan details
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {policy?.company && (
                <img
                  className="w-14 h-14 rounded-md object-cover border border-border"
                  src={policy?.company.logo || "/placeholder.svg"}
                  alt={policy?.company.name}
                />
              )}
              <div>
                <h2 className="font-semibold text-foreground">
                  {policy?.company?.name || "Select a company"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Policy information
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
                    type="submit"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  {!isCreate && (
                    <span
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-md hover:bg-muted transition-colors font-medium text-sm"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </span>
                  )}
                </>
              ) : isCreate ? (
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FilePlus className="h-4 w-4" />
                  Create
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors font-medium text-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </span>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                {/* <div className="w-1 h-6 bg-primary rounded-full"></div> */}
                Basic Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Company Name
                  </label>
                  {isEditing &&
                  (!editedPolicy?.company?.name || isCompanySearch) ? (
                    <DynamicSearchField
                      field={{
                        key: "companyId",
                        label: "Company",
                        type: "search",
                        required: true,
                        prev: "company.name",
                      }}
                      formState={editedPolicy}
                      handleChange={updatePolicyField}
                    />
                  ) : isEditing ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <p className="text-sm text-foreground flex-1">
                        {editedPolicy.company?.name}
                      </p>
                      <button
                        type="button"
                        className="text-accent hover:text-accent/80"
                        onClick={() => setIsCompanySearch(true)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-lg text-foreground p-3 bg-muted rounded-md">
                      {policy?.company?.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Policy Name
                  </label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                      value={editedPolicy?.name || ""}
                      onChange={(e) =>
                        updatePolicyField("name", e.target.value)
                      }
                      placeholder="Enter policy name"
                    />
                  ) : (
                    <p className="text-lg text-foreground p-3 bg-muted rounded-md">
                      {policy?.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-medium text-foreground">
                    Plan Type
                  </label>
                  {isEditing ? (
                    <select
                      value={editedPolicy?.type ?? ""}
                      onChange={(e) =>
                        updatePolicyField("type", e.target.value)
                      }
                      required={true}
                      className="border border-dark dark:border-gray-300 rounded px-2 py-1 w-fit"
                      disabled={!isCreate}
                    >
                      <option value="" className="dark:bg-black">
                        *None*
                      </option>
                      <option
                        value={"Individual_Medical"}
                        className="dark:bg-black"
                      >
                        Individual Medical
                      </option>
                      <option value={"SME"} className="dark:bg-black">
                        SME
                      </option>
                    </select>
                  ) : (
                    <p className="text-lg text-foreground p-3 bg-muted rounded-md">
                      {policy?.type === "CAR"
                        ? "Car Policy"
                        : policy?.type === "Individual_Medical"
                        ? "Individual Medical"
                        : policy?.type === "SME" && "SME Medical"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Tax (%)
                  </label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                      type="number"
                      value={editedPolicy?.tax?.toString() || ""}
                      onChange={(e) =>
                        updatePolicyField("tax", Number(e.target.value))
                      }
                      placeholder="0"
                    />
                  ) : (
                    <p className="text-lg text-foreground p-3 bg-muted rounded-md">
                      {policy?.tax ? `${policy.tax}%` : "—"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {/* <div className="w-1 h-6 bg-accent rounded-full"></div> */}
              Life Benefits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <PolicyField
                label="Life Insurance"
                value={editedPolicy?.healthPolicy?.lifeInsurance}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("lifeInsurance", val)}
                disabled={editedPolicy?.type === "Individual_Medical"}
                title={
                  editedPolicy?.type === "Individual_Medical"
                    ? "Life Insurance is not available for Individual Medical"
                    : ""
                }
              />
              <PolicyField
                label="Total Permanent Disability"
                value={editedPolicy?.healthPolicy?.totalPermanentDisability}
                isEditing={isEditing}
                onChange={(val) =>
                  updateHealthPolicy("totalPermanentDisability", val)
                }
              />
              <PolicyField
                label="Accidental Death"
                value={editedPolicy?.healthPolicy?.accidentalDeath}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("accidentalDeath", val)}
              />
              <PolicyField
                label="Partial Permanent Disability"
                value={editedPolicy?.healthPolicy?.partialPermanentDisability}
                isEditing={isEditing}
                onChange={(val) =>
                  updateHealthPolicy("partialPermanentDisability", val)
                }
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {/* <div className="w-1 h-6 bg-primary rounded-full"></div> */}
              Medical Benefits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <PolicyField
                label="Medical TPA"
                value={editedPolicy?.healthPolicy?.medicalTpa}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("medicalTpa", val)}
              />
              <PolicyField
                label="Network"
                value={editedPolicy?.healthPolicy?.network}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("network", val)}
              />
              <PolicyField
                label="Area of Coverage"
                value={editedPolicy?.healthPolicy?.areaOfCoverage}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("areaOfCoverage", val)}
              />
              <PolicyField
                label="Annual Ceiling Per Person"
                value={editedPolicy?.healthPolicy?.annualCeilingPerPerson}
                isEditing={isEditing}
                onChange={(val) =>
                  updateHealthPolicy("annualCeilingPerPerson", val)
                }
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-accent rounded-full"></div>
              In-Patient Benefits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <PolicyField
                label="In-Patient Accommodation"
                value={editedPolicy?.healthPolicy?.inPatientAccommodation}
                isEditing={isEditing}
                onChange={(val) =>
                  updateHealthPolicy("inPatientAccommodation", val)
                }
              />
              <PolicyField
                label="ICU"
                value={editedPolicy?.healthPolicy?.icu}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("icu", val)}
              />
              <PolicyField
                label="Parent Accommodation"
                value={editedPolicy?.healthPolicy?.parentAccommodation}
                isEditing={isEditing}
                onChange={(val) =>
                  updateHealthPolicy("parentAccommodation", val)
                }
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {/* <div className="w-1 h-6 bg-primary rounded-full"></div> */}
              Out-Patient Benefits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <PolicyField
                label="Doctor Consultation"
                value={editedPolicy?.healthPolicy?.doctorConsultation}
                isEditing={isEditing}
                onChange={(val) =>
                  updateHealthPolicy("doctorConsultation", val)
                }
              />
              <PolicyField
                label="Lab & Scan"
                value={editedPolicy?.healthPolicy?.labScan}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("labScan", val)}
              />
              <PolicyField
                label="Physiotherapy"
                value={editedPolicy?.healthPolicy?.physiotherapy}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("physiotherapy", val)}
              />
              <PolicyField
                label="Medication"
                value={editedPolicy?.healthPolicy?.medication}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("medication", val)}
              />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {/* <div className="w-1 h-6 bg-primary rounded-full"></div> */}
              Special Conditions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <PolicyField
                label="Dental"
                value={editedPolicy?.healthPolicy?.dental}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("dental", val)}
              />
              <PolicyField
                label="Optical"
                value={editedPolicy?.healthPolicy?.optical}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("optical", val)}
              />
              <PolicyField
                label="Maternity Limit"
                value={editedPolicy?.healthPolicy?.maternityLimit}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("maternityLimit", val)}
              />
              <PolicyField
                label="Newborn Ceiling"
                value={editedPolicy?.healthPolicy?.newbornCeiling}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("newbornCeiling", val)}
              />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {/* <div className="w-1 h-6 bg-primary rounded-full"></div> */}
              Other Benefits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <PolicyField
                label="Pre-Existing Cases"
                value={editedPolicy?.healthPolicy?.preExistingCases}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("preExistingCases", val)}
              />
              <PolicyField
                label="New Chronic"
                value={editedPolicy?.healthPolicy?.newChronic}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("newChronic", val)}
              />
              <PolicyField
                label="Organ Transplant"
                value={editedPolicy?.healthPolicy?.organTransplant}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("organTransplant", val)}
              />
              <PolicyField
                label="Ground Ambulance"
                value={editedPolicy?.healthPolicy?.groundAmbulance}
                isEditing={isEditing}
                onChange={(val) => updateHealthPolicy("groundAmbulance", val)}
              />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {/* <div className="w-1 h-6 bg-primary rounded-full"></div> */}
              Reimbursement Rules
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <PolicyField
                label="Reimbursement Coverage"
                value={editedPolicy?.healthPolicy?.reimbursementCoverage}
                isEditing={isEditing}
                onChange={(val) =>
                  updateHealthPolicy("reimbursementCoverage", val)
                }
              />
            </div>
          </div>
          {editedPolicy?.healthPolicy && (
            <HealthPricing
              pricings={editedPolicy.healthPolicy.healthPricings || {}}
              isEditing={isEditing}
              onPricingsChange={(newPricings) => {
                setEditedPolicy((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    healthPolicy: {
                      ...prev.healthPolicy!,
                      healthPricings: newPricings,
                    },
                  };
                });
              }}
            />
          )}
        </form>
      </div>
    </main>
  );
}

function PolicyField({
  label,
  value,
  isEditing,
  onChange,
  disabled = false,
  title,
}: {
  label: string;
  value: any;
  isEditing: boolean;
  onChange: (val: any) => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {isEditing ? (
        <input
          className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:cursor-not-allowed"
          required
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter value"
          disabled={disabled}
          title={title}
        />
      ) : (
        <p className="text-lg text-foreground p-1 bg-muted rounded-md">
          {value || "—"}
        </p>
      )}
    </div>
  );
}
