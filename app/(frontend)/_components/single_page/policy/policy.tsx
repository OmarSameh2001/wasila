"use client"

import { useState } from "react"

import { Pencil, Save, X } from "lucide-react"
import { HealthPolicy, healthPricing } from "@/app/(frontend)/_dto/policy"


export default function SinglePolicyEditable({ policy }: { policy: HealthPolicy }) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedPolicy, setEditedPolicy] = useState<HealthPolicy>(policy || {})

  const handleCancel = () => {
    setEditedPolicy(policy)
    setIsEditing(false)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const updatePolicy = (field: string, value: any) => {
    setEditedPolicy({
      ...editedPolicy,
      [field]: value,
    })
  }


  const updateHealthPolicy = (field: string, value: any) => {
  setEditedPolicy((prev) =>
    prev && prev.healthPolicy
      ? {
          ...prev,
          healthPolicy: {
            ...prev.healthPolicy,
            [field]: value,
          },
        }
      : prev,
  )
}

  const updatePricing = (
  pricingId: number,
  field: string,
  value: number,
) => {
  setEditedPolicy((prev) => {
    if (!prev || !prev.healthPolicy.healthPricings) return prev

    return {
      ...prev,
      healthPolicy: {
        ...prev.healthPolicy,
        healthPricings: prev.healthPolicy.healthPricings.map((pricing) =>
          pricing.id === pricingId
            ? { ...pricing, [field]: value }
            : pricing,
        ),
      },
    }
  })
}


  if (!editedPolicy || Object.keys(editedPolicy).length === 0) {
    return (
      <div className="flex flex-col min-h-[70vh] justify-center items-center p-4">
        <h1 className="text-2xl font-bold mb-6">Single Policy</h1>
        <p className="text-muted-foreground">No policies available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[70vh] justify-center items-center p-4 pb-12">
      <h1 className="text-2xl font-bold mb-6">Single Policy</h1>

      {
        // const isEditing = editingId === policy.id

          <div key={policy.id} className="w-full max-w-4xl my-4">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                
                  <img
                    className="w-16 h-16 rounded object-cover"
                    src={policy.company.logo || "/placeholder.svg"}
                    alt={policy.company.name}
                  />
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={() => handleSave()}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label>Company Name</label>
                    {isEditing ? (
                      <input
                        value={policy.company.name}
                        // onChange={(e) => updateCompany(policy.id, "name", e.target.value)}
                      />
                    ) : (
                      <p className="font-medium">{policy.company.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label>Policy Name</label>
                    {isEditing ? (
                      <input value={policy.name} onChange={(e) => updatePolicy("name", e.target.value)} />
                    ) : (
                      <p className="font-medium">{policy.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label>Policy Type</label>
                    {isEditing ? (
                      <select
                        value={policy.type}
                        onChange={(e) => updatePolicy("type", e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="CAR">Car Policy</option>
                        <option value="HEALTH">Health Policy</option>
                        <option value="SME">SME Policy</option>
                      </select>
                    ) : (
                      <p className="text-sm">
                        {policy.type === "CAR"
                          ? "Car Policy"
                          : policy.type === "HEALTH"
                            ? "Health Policy"
                            : "SME Policy"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label>Tax (%)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={policy.tax || 0}
                        onChange={(e) => updatePolicy("tax", Number(e.target.value))}
                      />
                    ) : (
                      <p className="text-sm">{policy.tax || 0}%</p>
                    )}
                  </div>
                </div>
              </div>

              {policy.type === "HEALTH" && policy.healthPolicy && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Coverage Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>Life Insurance</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.lifeInsurance}
                            onChange={(e) => updateHealthPolicy("lifeInsurance", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.lifeInsurance}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Total Permanent Disability</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.totalPermanentDisability}
                            onChange={(e) => updateHealthPolicy("totalPermanentDisability", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.totalPermanentDisability}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Accidental Death</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.accidentalDeath}
                            onChange={(e) => updateHealthPolicy("accidentalDeath", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.accidentalDeath}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Partial Permanent Disability</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.partialPermanentDisability}
                            onChange={(e) =>
                              updateHealthPolicy("partialPermanentDisability", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.partialPermanentDisability}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Medical Services</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>Medical TPA</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.medicalTpa}
                            onChange={(e) => updateHealthPolicy("medicalTpa", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.medicalTpa}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Network</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.network}
                            onChange={(e) => updateHealthPolicy("network", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.network}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Area of Coverage</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.areaOfCoverage}
                            onChange={(e) => updateHealthPolicy("areaOfCoverage", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.areaOfCoverage}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Annual Ceiling Per Person</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={policy.healthPolicy.annualCeilingPerPerson}
                            onChange={(e) =>
                              updateHealthPolicy("annualCeilingPerPerson", Number(e.target.value))
                            }
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.annualCeilingPerPerson}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>In-Patient Accommodation</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.inPatientAccommodation}
                            onChange={(e) => updateHealthPolicy("inPatientAccommodation", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.inPatientAccommodation}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>ICU</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.icu}
                            onChange={(e) => updateHealthPolicy("icu", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.icu}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Parent Accommodation</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.parentAccommodation}
                            onChange={(e) => updateHealthPolicy("parentAccommodation", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.parentAccommodation}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Doctor Consultation</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.doctorConsultation}
                            onChange={(e) => updateHealthPolicy("doctorConsultation", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.doctorConsultation}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Lab & Scan</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.labScan}
                            onChange={(e) => updateHealthPolicy("labScan", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.labScan}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Physiotherapy</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.physiotherapy}
                            onChange={(e) => updateHealthPolicy("physiotherapy", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.physiotherapy}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Medication</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.medication}
                            onChange={(e) => updateHealthPolicy("medication", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.medication}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Dental</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.dental}
                            onChange={(e) => updateHealthPolicy("dental", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.dental}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Optical</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.optical}
                            onChange={(e) => updateHealthPolicy("optical", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.optical}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Special Conditions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>Maternity Limit</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.maternityLimit}
                            onChange={(e) => updateHealthPolicy("maternityLimit", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.maternityLimit}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Newborn Ceiling</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.newbornCeiling}
                            onChange={(e) => updateHealthPolicy("newbornCeiling", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.newbornCeiling}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Pre-Existing Cases</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.preExistingCases}
                            onChange={(e) => updateHealthPolicy("preExistingCases", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.preExistingCases}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>New Chronic</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.newChronic}
                            onChange={(e) => updateHealthPolicy("newChronic", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.newChronic}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Organ Transplant</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.organTransplant}
                            onChange={(e) => updateHealthPolicy("organTransplant", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.organTransplant}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Ground Ambulance</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.groundAmbulance}
                            onChange={(e) => updateHealthPolicy("groundAmbulance", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.groundAmbulance}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Reimbursement Coverage</label>
                        {isEditing ? (
                          <input
                            value={policy.healthPolicy.reimbursementCoverage}
                            onChange={(e) => updateHealthPolicy("reimbursementCoverage", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.reimbursementCoverage}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>Number of Insured Members</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={policy.healthPolicy.numberOfInsuredMembers}
                            onChange={(e) =>
                              updateHealthPolicy("numberOfInsuredMembers", Number(e.target.value))
                            }
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.numberOfInsuredMembers}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label>Average Premium Per Head</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={policy.healthPolicy.averagePremiumPerHead}
                            onChange={(e) =>
                              updateHealthPolicy("averagePremiumPerHead", Number(e.target.value))
                            }
                          />
                        ) : (
                          <p className="text-sm">{policy.healthPolicy.averagePremiumPerHead}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {policy.healthPolicy.healthPricings && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Health Pricing</h3>
                      <div className="space-y-3">
                        {policy.healthPolicy.healthPricings.map((pricing) => (
                          <div key={pricing.id} className="p-4 border border-border rounded-md space-y-2">
                            {isEditing ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <label className="text-xs">Min Age</label>
                                  <input
                                    type="number"
                                    value={pricing.minAge}
                                    onChange={(e) =>
                                      updatePricing(pricing.id, "minAge", Number(e.target.value))
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-xs">Max Age</label>
                                  <input
                                    type="number"
                                    value={pricing.maxAge}
                                    onChange={(e) =>
                                      updatePricing(pricing.id, "maxAge", Number(e.target.value))
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-xs">Main Price</label>
                                  <input
                                    type="number"
                                    value={pricing.mainPrice}
                                    onChange={(e) =>
                                      updatePricing(pricing.id, "mainPrice", Number(e.target.value))
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-xs">Dependent Price</label>
                                  <input
                                    type="number"
                                    value={pricing.dependentPrice}
                                    onChange={(e) =>
                                      updatePricing(pricing.id, "dependentPrice", Number(e.target.value))
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm">
                                Age {pricing.minAge}-{pricing.maxAge}: Main Price: {pricing.mainPrice}, Dependent Price:{" "}
                                {pricing.dependentPrice}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        
      }
    </div>
  )
}
