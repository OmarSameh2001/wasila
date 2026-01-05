"use client";

import { useState } from "react";

import { FilePlus, Pencil, Save, X } from "lucide-react";
import { HealthPolicy, healthPricing } from "@/app/(frontend)/_dto/policy";
import DynamicSearchField from "../../form/search_field";
import DynamicInputField from "../../form/dynamic_input_field";
import { createPolicy, updatePolicy } from "@/app/(frontend)/_services/policy";
import HealthPricing from "./health_pricing";
import { useRouter } from "next/navigation";

export default function SinglePolicyEditable({
  policy,
}: {
  policy: HealthPolicy;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(!(typeof policy === "object" && Object.keys(policy).length > 0));
  const [editedPolicy, setEditedPolicy] = useState<HealthPolicy>(policy || {});
  const router = useRouter();

  const handleCancel = () => {
    setEditedPolicy(policy);
    setIsEditing(false);
  };

  const handleSave = (e: any) => {
    try{
    e.preventDefault();
    if (!editedPolicy.companyId) window.alert("Please select a company");
    isCreate
      ? createPolicy(editedPolicy)
      : updatePolicy(editedPolicy.id, editedPolicy);

    router.push("/admin/policy");
    }catch(e){
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

  const isCreate = !(
    typeof policy === "object" && Object.keys(policy).length > 0
  );
  // console.log(isCreate);
  return (
    <div className="flex min-w-full flex-col min-h-[70vh] justify-center items-center p-4 pb-12 bg-[#2386c9] dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6">Single Policy</h1>

      {
        // const isEditing = editingId === policy.id

        <form
          className="w-full max-w-10/16 my-4"
          onSubmit={(e) => handleSave(e)}
        >
          <div
            className={`flex items-center ${
              policy?.company ? "justify-between" : "justify-end"
            }`}
          >
            {policy?.company && (
              <div className="flex items-center gap-2">
                <img
                  className="w-16 h-16 rounded object-cover"
                  src={policy?.company.logo || "/placeholder.svg"}
                  alt={policy?.company.name}
                />
              </div>
            )}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button className="flex flex-col items-center" type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  {!isCreate && <button
                    className="flex flex-col items-center"
                    onClick={() => handleCancel()}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>}
                </>
              ) : isCreate ? (
                <button
                  className="flex flex-col items-center"
                  onClick={() => setIsEditing(true)}
                >
                  <FilePlus className="h-4 w-4" />
                  Create
                </button>
              ) : (
                <button
                  className="flex flex-col items-center"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Basic Information
              </h3>
              <div className="flex gap-4 flex-wrap justify-between justify-between">
                <div className="space-y-2 flex gap-4">
                  <label>Company Name</label>
                  {isEditing ? (
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
                  ) : (
                    <p className="text-sm">{policy?.company.name}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Policy Name</label>
                  {isEditing ? (
                    <input
                      className="border rounded h-fit"
                      required
                      value={editedPolicy?.name || ""}
                      onChange={(e) =>
                        updatePolicyField("name", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.name}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Policy Type</label>
                  {isEditing ? (
                    <DynamicInputField
                      field={{
                        key: "type",
                        label: "Type",
                        type: "select",
                        choices: ["HEALTH", "SME"],
                        required: true,
                      }}
                      formState={editedPolicy}
                      handleChange={updatePolicyField}
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.type === "CAR"
                        ? "Car Policy"
                        : policy?.type === "HEALTH"
                        ? "Health Policy"
                        : policy?.type === "HEALTH" && "SME Policy"}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Tax (%)</label>
                  {isEditing ? (
                    <input
                      className="border rounded h-fit"
                      required
                      type="number"
                      value={editedPolicy?.tax?.toString() || ""}
                      onChange={(e) =>
                        updatePolicyField("tax", Number(e.target.value))
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.tax ? `${policy.tax}%` : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Life Benefits
              </h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-2 flex gap-4 items-center justify-between">
                  <label>Life Insurance</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.lifeInsurance || ""}
                      onChange={(e) =>
                        updateHealthPolicy("lifeInsurance", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.lifeInsurance}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Total Permanent Disability</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={
                        editedPolicy?.healthPolicy?.totalPermanentDisability ||
                        ""
                      }
                      onChange={(e) =>
                        updateHealthPolicy(
                          "totalPermanentDisability",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.totalPermanentDisability}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Accidental Death</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.accidentalDeath || ""}
                      onChange={(e) =>
                        updateHealthPolicy("accidentalDeath", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.accidentalDeath}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Partial Permanent Disability</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={
                        editedPolicy?.healthPolicy
                          ?.partialPermanentDisability || ""
                      }
                      onChange={(e) =>
                        updateHealthPolicy(
                          "partialPermanentDisability",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.partialPermanentDisability}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Medical Benifits
              </h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-2 flex gap-4 items-center">
                  <label>Medical TPA</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.medicalTpa || ""}
                      onChange={(e) =>
                        updateHealthPolicy("medicalTpa", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.medicalTpa}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Network</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.network || ""}
                      onChange={(e) =>
                        updateHealthPolicy("network", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.network}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Area of Coverage</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.areaOfCoverage || ""}
                      onChange={(e) =>
                        updateHealthPolicy("areaOfCoverage", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.areaOfCoverage}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Annual Ceiling Per Person</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={
                        editedPolicy?.healthPolicy?.annualCeilingPerPerson || ""
                      }
                      onChange={(e) =>
                        updateHealthPolicy(
                          "annualCeilingPerPerson",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.annualCeilingPerPerson}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                In-Patient Benifits
              </h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-2 flex gap-4 items-center">
                  <label>In-Patient Accommodation</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={
                        editedPolicy?.healthPolicy?.inPatientAccommodation || ""
                      }
                      onChange={(e) =>
                        updateHealthPolicy(
                          "inPatientAccommodation",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.inPatientAccommodation}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>ICU</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.icu || ""}
                      onChange={(e) =>
                        updateHealthPolicy("icu", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.icu}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Parent Accommodation</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={
                        editedPolicy?.healthPolicy?.parentAccommodation || ""
                      }
                      onChange={(e) =>
                        updateHealthPolicy(
                          "parentAccommodation",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.parentAccommodation}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Out-Patient Benifits
              </h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-2 flex gap-4 items-center">
                  <label>Doctor Consultation</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={
                        editedPolicy?.healthPolicy?.doctorConsultation || ""
                      }
                      onChange={(e) =>
                        updateHealthPolicy("doctorConsultation", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.doctorConsultation}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Lab & Scan</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.labScan || ""}
                      onChange={(e) =>
                        updateHealthPolicy("labScan", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.labScan}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Physiotherapy</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.physiotherapy || ""}
                      onChange={(e) =>
                        updateHealthPolicy("physiotherapy", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.physiotherapy}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Medication</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.medication || ""}
                      onChange={(e) =>
                        updateHealthPolicy("medication", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.medication}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Special Conditions
              </h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-2 flex gap-4 items-center">
                  <label>Dental</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.dental || ""}
                      onChange={(e) =>
                        updateHealthPolicy("dental", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.dental}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Optical</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.optical || ""}
                      onChange={(e) =>
                        updateHealthPolicy("optical", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.optical}</p>
                  )}
                </div>
                <div className="space-y-2 flex gap-4 items-center">
                  <label>Maternity Limit</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.maternityLimit || ""}
                      onChange={(e) =>
                        updateHealthPolicy("maternityLimit", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.maternityLimit}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Newborn Ceiling</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.newbornCeiling || ""}
                      onChange={(e) =>
                        updateHealthPolicy("newbornCeiling", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.newbornCeiling}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Other Benefits
              </h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-2 flex gap-4 items-center">
                  <label>Pre-Existing Cases</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.preExistingCases || ""}
                      onChange={(e) =>
                        updateHealthPolicy("preExistingCases", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.preExistingCases}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>New Chronic</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.newChronic || ""}
                      onChange={(e) =>
                        updateHealthPolicy("newChronic", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{policy?.healthPolicy.newChronic}</p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Organ Transplant</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.organTransplant || ""}
                      onChange={(e) =>
                        updateHealthPolicy("organTransplant", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.organTransplant}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex gap-4 items-center">
                  <label>Ground Ambulance</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={editedPolicy?.healthPolicy?.groundAmbulance || ""}
                      onChange={(e) =>
                        updateHealthPolicy("groundAmbulance", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.groundAmbulance}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Reimbursement Rules
              </h3>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-2 flex gap-4 items-center">
                  <label>Reimbursement Coverage</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2 h-fit"
                      required
                      value={
                        editedPolicy?.healthPolicy?.reimbursementCoverage || ""
                      }
                      onChange={(e) =>
                        updateHealthPolicy(
                          "reimbursementCoverage",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.reimbursementCoverage}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Statistics
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 flex gap-4 items-center">
                  <label>Number of Insured Members</label>
                  {isEditing ? (
                    <input
                      className="border rounded p-2"
                      required
                      type="number"
                      value={policy?.healthPolicy.numberOfInsuredMembers}
                      onChange={(e) =>
                        updateHealthPolicy(
                          "numberOfInsuredMembers",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.numberOfInsuredMembers}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label>Average Premium Per Head</label>
                  {isEditing ? (
                    <input
                      required
                      type="number"
                      value={policy?.healthPolicy.averagePremiumPerHead}
                      onChange={(e) =>
                        updateHealthPolicy(
                          "averagePremiumPerHead",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {policy?.healthPolicy.averagePremiumPerHead}
                    </p>
                  )}
                </div>
              </div>
            </div> */}

            {editedPolicy?.healthPolicy && (
              <HealthPricing
                pricings={editedPolicy.healthPolicy.healthPricings || []}
                isEditing={isEditing}
                onPricingsChange={(newPricings) => {
                  setEditedPolicy((prev) => ({
                    ...prev,
                    healthPolicy: {
                      ...prev.healthPolicy,
                      healthPricings: newPricings,
                    },
                  }));
                }}
              />
            )}
          </div>
        </form>
      }
    </div>
  );
}
