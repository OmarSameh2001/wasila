import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { filterPrisma } from "../../_lib/filtering";

export async function getRecords(
  req: NextRequest,
  userId: number,
  type: string
) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const params: any = {};
    if (type === "BROKER") params.brokerId = userId;
    if (type === "USER") params.clientId = userId;

    return await filterPrisma(
      prisma.record,
      page,
      limit,
      params,
      url,
      "record",
      {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        broker: {
          select: {
            id: true,
            name: true,
          },
        },
        policies: true,
      }
    );
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Error fetching records" },
      { status: 500 }
    );
  }
}

export async function getRecord(
  req: NextRequest,
  userId: number,
  type: string,
  recordId: number
) {
  try {
    const record = await prisma.record.findUnique({
      where: {
        id: recordId,
        ...(type === "BROKER"
          ? { brokerId: userId }
          : type === "USER" && { clientId: userId }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        broker: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        policies: {
          include: {
            policy: {
              include: {
                company: true,
                healthPolicy: {
                  select: {
                    lifeInsurance: true,
                    totalPermanentDisability: true,
                    accidentalDeath: true,
                    partialPermanentDisability: true,
                    medicalTpa: true,
                    network: true,
                    areaOfCoverage: true,
                    annualCeilingPerPerson: true,
                    inPatientAccommodation: true,
                    icu: true,
                    parentAccommodation: true,
                    doctorConsultation: true,
                    labScan: true,
                    physiotherapy: true,
                    medication: true,
                    dental: true,
                    optical: true,
                    maternityLimit: true,
                    newbornCeiling: true,
                    preExistingCases: true,
                    newChronic: true,
                    organTransplant: true,
                    groundAmbulance: true,
                    reimbursementCoverage: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Error fetching record" },
      { status: 500 }
    );
  }
}

// export async function getRecordsByBroker(
//   req: NextRequest,
//   userId: number,
//   type: string,
//   brokerId: number
// ) {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);

//     brokerId = type === "BROKER" ? userId : brokerId;
//     if (!brokerId)
//       return NextResponse.json({ error: "Missing brokerId" }, { status: 400 });

//     console.log(prisma.record.fields);
//     const records = await filterPrisma(
//       prisma.record,
//       page,
//       limit,
//       { brokerId },
//       url,
//       "record"
//     );

//     return NextResponse.json(records, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching records:", error);
//     return NextResponse.json(
//       { error: "Error fetching records" },
//       { status: 500 }
//     );
//   }
// }

// export async function getRecordByClient(
//   req: NextRequest,
//   userId: number,
//   type: string,
//   clientId: number
// ) {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);

//     clientId = type === "USER" ? userId : clientId;
//     if (!clientId)
//       return NextResponse.json({ error: "Missing clientId" }, { status: 400 });

//     const records = await filterPrisma(
//       prisma.record,
//       page,
//       limit,
//       { clientId },
//       url,
//       "record"
//     );
//     return NextResponse.json(records, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching records:", error);
//     return NextResponse.json(
//       { error: "Error fetching records" },
//       { status: 500 }
//     );
//   }
// }

export async function createRecord(req: NextRequest) {
  try {
    const {
      policyId,
      clientId,
      brokerId,
      totalAmount,
      state,
      carDetails,
      healthDetails,
    } = await req.json();
    const record = await prisma.record.create({
      data: {
        policyId,
        clientId,
        brokerId,
        totalAmount,
        state: state || "DRAFT",
        ...(carDetails && { carDetails }),
        ...(healthDetails && { healthDetails }),
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Error creating record" },
      { status: 500 }
    );
  }
}

export async function updateRecord(
  req: NextRequest,
  userId: number,
  type: string,
  id: number
) {
  try {
    const {
      id: _id,
      clientId: _clientId,
      brokerId: _brokerId,
      client,
      broker,
      ...data
    } = await req.json();

    // const { clientId, brokerId: _brokerId, ...newData } = data;
    // const recordData = type === "BROKER" ? newData : data;
    const record = await prisma.record.update({
      where: { id, ...(type === "BROKER" && { brokerId: userId }) },
      data: { ...data },
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Error updating record" },
      { status: 500 }
    );
  }
}

export async function deleteRecord(
  req: NextRequest,
  userId: number,
  type: string,
  recorId: number
) {
  try {
    const record = await prisma.record.delete({
      where: { id: recorId, ...(type === "BROKER" && { brokerId: userId }) },
    });

    const user = await prisma.user.updateMany({
      where: { id: { in: [record.clientId, record.brokerId] } },
      data: { clientCount: { decrement: 1 }, managedCount: { decrement: 1 } },
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Error deleting record" },
      { status: 500 }
    );
  }
}
interface PersonData {
  birthDate: string; // "1/1/1990"
  type: "Employee" | "Dependent";
}

interface CalculatedSmePolicyRecord {
  policyId: number;
  policyName: string;
  companyName: string;
  companyLogo: string;
  numberOfInsureds: number;
  numberOfPersons: number;
  averageAge: number;
  totalAmount: number;
  totalTaxed: number;
  avgPricePerPerson: number;
  policy: any;
  policyDescription: string;
  insuredPeople: {
    age: number;
    type: "Employee" | "Dependent";
    price: number;
    isInsured: boolean;
    reason?: string;
  }[];
}

function calculateAge(birthDate: string, issueDate: string): number {
  const [month, day, year] = birthDate.split("/").map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date(issueDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

function findPriceForAge(
  healthPricings: any,
  age: number,
  isDependent: boolean
): { price: number | null; reason?: string } {
  // Find exact age match
  const pricing = healthPricings[age.toString()];

  if (!pricing) {
    return {
      price: null,
      reason: `No insurance for age ${age}`,
    };
  }

  const priceField = isDependent ? pricing.dependentPrice : pricing.mainPrice;

  // Check for invalid values: undefined, null, 0, or NaN
  if (
    priceField === undefined ||
    priceField === null ||
    priceField === 0 ||
    isNaN(priceField)
  ) {
    return {
      price: null,
      reason: `No ${isDependent ? "dependent" : "main"} price for age ${age}`,
    };
  }

  return { price: Number(priceField) };
}

export async function calculateSmePolicyRecords(req: NextRequest, userId: number, userType: string) {
  try {
    const { people, policyIds, issueDate } = (await req.json()) as {
      people: PersonData[];
      policyIds?: number[]; // Optional: filter specific policies
      issueDate: string;
    };

    if (!people || !Array.isArray(people) || people.length === 0) {
      return NextResponse.json(
        { error: "People array is required" },
        { status: 400 }
      );
    }

    // Fetch all health policies (or filtered by policyIds)
    const policies = await prisma.policy.findMany({
      where: {
        type: "SME",
        ...(policyIds && policyIds.length > 0 && { id: { in: policyIds } }),
        ...(userType === "BROKER" && {
          OR: [{ brokerId: Number(userId) }, { brokerId: null }],
        })
      },
      include: {
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
        healthPolicy: true,
      },
    });

    if (policies.length === 0) {
      return NextResponse.json(
        { error: "No health policies found" },
        { status: 404 }
      );
    }

    const calculatedRecords: CalculatedSmePolicyRecord[] = [];

    // Calculate for each policy
    for (const policy of policies) {
      if (!policy.healthPolicy) continue;

      const healthPricingsObject = policy.healthPolicy.healthPricings as any[];
      const insuredPeople: CalculatedSmePolicyRecord["insuredPeople"] = [];

      let totalAmount = 0;
      let numberOfInsureds = 0;
      // let numberOfEmployees = 0;
      // let numberOfDependents = 0;

      // let numberOfPersons = 0;
      let totalAge = 0;

      // Process each person
      for (const person of people) {
        const age = calculateAge(person.birthDate, issueDate);
        const isDependent = person.type === "Dependent";

        const { price, reason } = findPriceForAge(
          healthPricingsObject,
          age,
          isDependent
        );

        if (price !== null) {
          totalAmount += price;
          numberOfInsureds++;
          totalAge += age;

          // if (isDependent) {
          //   numberOfDependents++;
          // } else {
          //   numberOfEmployees++;
          // }

          // numberOfPersons++;
        }

        insuredPeople.push({
          age,
          type: person.type,
          price: price || 0,
          isInsured: price !== null,
          reason,
        });
      }

      // Calculate totals
      const averageAge =
        numberOfInsureds > 0 ? Math.round(totalAge / numberOfInsureds) : 0;

      const avgPricePerPerson =
        numberOfInsureds > 0 ? totalAmount / numberOfInsureds : 0;

      const taxRate = policy.tax ? Number(policy.tax) / 100 : 0;
      const totalTaxed = totalAmount * (1 + taxRate);

      const policyDescription = `${policy.company.name} ${policy.name} - ${numberOfInsureds} insured from ${people.length} - Avg age: ${averageAge}`;
      const { healthPricings, ...healthWithoutPricing } = policy.healthPolicy;

      calculatedRecords.push({
        policyId: policy.id,
        policyName: policy.name,
        companyName: policy.company.name,
        companyLogo: policy.company.logo || "",
        policy: healthWithoutPricing,
        numberOfInsureds,
        numberOfPersons: people.length,
        averageAge,
        totalAmount,
        totalTaxed,
        avgPricePerPerson,
        policyDescription,
        insuredPeople: insuredPeople.sort((a, b) => a.age - b.age),
      });
    }

    // Sort by total amount (best value first)
    calculatedRecords.sort((a, b) => a.totalAmount - b.totalAmount);

    return NextResponse.json(
      {
        calculatedRecords,
        summary: {
          totalPeople: people.length,
          totalEmployees: people.filter((p) => p.type === "Employee").length,
          totalDependents: people.filter((p) => p.type === "Dependent").length,
          policiesCalculated: calculatedRecords.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating policy records:", error);
    return NextResponse.json(
      { error: "Error calculating policy records" },
      { status: 500 }
    );
  }
}

// API Route: /api/records/create-bulk
export async function createBulkRecord(
  req: NextRequest,
  userId: number,
  type: string
) {
  try {
    const {
      clientId,
      brokerId,
      state,
      selectedPolicies, // Array of CalculatedSmePolicyRecord
      issueDate,
    } = await req.json();

    if (
      !selectedPolicies ||
      selectedPolicies.length === 0 ||
      selectedPolicies.length > 6
    ) {
      return NextResponse.json(
        { error: "Select between 1 and 6 policies" },
        { status: 400 }
      );
    }

    if (!issueDate || !clientId) {
      return NextResponse.json(
        { error: "Issue date and client is required" },
        { status: 400 }
      );
    }

    const issueDateParsed = new Date(issueDate);

    if (isNaN(issueDateParsed.getTime())) {
      return NextResponse.json(
        { error: "Invalid issue date" },
        { status: 400 }
      );
    }

    const client = await prisma.user.findUnique({
      where: { id: clientId, type: { in: ["CLIENT", "USER"] } },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const effectiveBrokerId = type === "BROKER" ? userId : brokerId;

    const broker = await prisma.user.findUnique({
      where: {
        id: effectiveBrokerId,
        type: "BROKER",
      },
    });

    if (!broker) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }
    console.log("selectedPolicies", selectedPolicies);
    // Create record with record policies
    const record = await prisma.record.create({
      data: {
        clientId,
        brokerId: effectiveBrokerId,
        issueDate: issueDateParsed,
        state: state || "DRAFT",
        type: "SME",
        policies: {
          create: selectedPolicies.map((p: CalculatedSmePolicyRecord) => ({
            policyId: p.policyId,
            totalAmount: p.totalAmount,
            totalTaxed: p.totalTaxed,
            policyDescription: p.policyDescription,
            numberOfInsureds: p.numberOfInsureds,
            numberOfPersons: p.numberOfPersons,
            averageAge: p.averageAge,
            avgPricePerPerson: p.avgPricePerPerson,
          })),
        },
      },
      include: {
        policies: {
          include: {
            policy: {
              include: {
                company: true,
              },
            },
          },
        },
        client: true,
        broker: true,
      },
    });
    await prisma.user.updateMany({
      where: {
        id: {
          in: [clientId, effectiveBrokerId],
        },
      },
      data: {
        clientCount: {
          increment: 1,
        },
        managedCount: {
          increment: 1,
        },
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating bulk record:", error);
    return NextResponse.json(
      { error: "Error creating bulk record" },
      { status: 500 }
    );
  }
}

interface FamilyData {
  main: string; // date string from date input
  spouse: string[]; // array of date strings
  children: string[]; // array of date strings
}

interface CalculatedIndividualPolicyRecord {
  policyId: number;
  policyName: string;
  companyName: string;
  companyLogo: string;
  numberOfInsureds: number;
  numberOfPersons: number;
  averageAge: number;
  totalAmount: number;
  totalTaxed: number;
  avgPricePerPerson: number;
  policy: any;
  policyDescription: string;
  insuredPeople: {
    age: number;
    type: "Main" | "Spouse" | "Child";
    price: number;
    isInsured: boolean;
    reason?: string;
  }[];
}

function calculateAgeFromDateInput(
  dateInput: string,
  issueDate: string
): number {
  const birth = new Date(dateInput);
  const today = new Date(issueDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

function findPriceForFamilyMember(
  healthPricings: any,
  age: number,
  isMain: boolean
): { price: number | null; reason?: string } {
  const pricing = healthPricings[age.toString()];

  if (!pricing) {
    return {
      price: null,
      reason: `No coverage available for age ${age}`,
    };
  }

  const priceField = isMain ? pricing.mainPrice : pricing.dependentPrice;

  if (
    priceField === undefined ||
    priceField === null ||
    priceField === 0 ||
    isNaN(priceField)
  ) {
    return {
      price: null,
      reason: `No ${isMain ? "main" : "dependent"} coverage for age ${age}`,
    };
  }

  return { price: Number(priceField) };
}

export async function calculateIndividualPolicyRecords(req: NextRequest, userId: number, userType: string) {
  try {
    const { family, policyIds, issueDate } = (await req.json()) as {
      family: FamilyData;
      policyIds?: number[];
      issueDate: string;
    };

    if (!family || !family.main) {
      return NextResponse.json(
        { error: "Main individual is required" },
        { status: 400 }
      );
    }

    // Fetch all Individual Medical policies
    const policies = await prisma.policy.findMany({
      where: {
        type: "Individual_Medical",
        ...(policyIds && policyIds.length > 0 && { id: { in: policyIds } }),
        ...(userType === "BROKER" && {
          OR: [{ brokerId: Number(userId) }, { brokerId: null }],
        })
      },
      include: {
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
        healthPolicy: true,
      },
    });

    if (policies.length === 0) {
      return NextResponse.json(
        { error: "No Individual Medical policies found" },
        { status: 404 }
      );
    }

    const calculatedRecords: CalculatedIndividualPolicyRecord[] = [];

    // Calculate for each policy
    for (const policy of policies) {
      if (!policy.healthPolicy) continue;

      const healthPricingsObject = policy.healthPolicy.healthPricings as any[];
      const insuredFamily: CalculatedIndividualPolicyRecord["insuredPeople"] =
        [];

      let totalAmount = 0;
      let numberOfInsureds = 0;
      let totalAge = 0;
      let totalFamilyMembers = 1; // Start with main

      // Process main individual
      const mainAge = calculateAgeFromDateInput(family.main, issueDate);
      const mainPricing = findPriceForFamilyMember(
        healthPricingsObject,
        mainAge,
        true
      );

      // Skip this policy if main is not insured
      if (mainPricing.price === null) {
        continue;
      }

      totalAmount += mainPricing.price;
      numberOfInsureds++;
      totalAge += mainAge;

      insuredFamily.push({
        age: mainAge,
        type: "Main",
        price: mainPricing.price,
        isInsured: true,
      });

      // Process spouses
      for (const spouseDob of family.spouse) {
        if (!spouseDob) continue;
        totalFamilyMembers++;

        const spouseAge = calculateAgeFromDateInput(spouseDob, issueDate);
        const { price, reason } = findPriceForFamilyMember(
          healthPricingsObject,
          spouseAge,
          false
        );

        if (price !== null) {
          totalAmount += price;
          numberOfInsureds++;
          totalAge += spouseAge;
        }

        insuredFamily.push({
          age: spouseAge,
          type: "Spouse",
          price: price || 0,
          isInsured: price !== null,
          reason,
        });
      }

      // Process children
      for (const childDob of family.children) {
        if (!childDob) continue;
        totalFamilyMembers++;

        const childAge = calculateAgeFromDateInput(childDob, issueDate);
        const { price, reason } = findPriceForFamilyMember(
          healthPricingsObject,
          childAge,
          false
        );

        if (price !== null) {
          totalAmount += price;
          numberOfInsureds++;
          totalAge += childAge;
        }

        insuredFamily.push({
          age: childAge,
          type: "Child",
          price: price || 0,
          isInsured: price !== null,
          reason,
        });
      }

      // Calculate totals
      const averageAge =
        numberOfInsureds > 0 ? Math.round(totalAge / numberOfInsureds) : 0;

      const avgPricePerPerson =
        numberOfInsureds > 0 ? totalAmount / numberOfInsureds : 0;

      const taxRate = policy.tax ? Number(policy.tax) / 100 : 0;
      const totalTaxed = totalAmount * (1 + taxRate);

      const policyDescription = `${policy.company.name} ${policy.name} - ${numberOfInsureds} insured from ${totalFamilyMembers} family members - Avg age: ${averageAge}`;

      const { healthPricings, ...healthWithoutPricing } = policy.healthPolicy;

      calculatedRecords.push({
        policyId: policy.id,
        policyName: policy.name,
        companyName: policy.company.name,
        companyLogo: policy.company.logo || "",
        policy: healthWithoutPricing,
        numberOfInsureds,
        numberOfPersons: totalFamilyMembers,
        averageAge,
        totalAmount,
        totalTaxed,
        avgPricePerPerson,
        policyDescription,
        insuredPeople: insuredFamily.sort((a, b) => a.age - b.age),
      });
    }

    // Sort by total amount (best value first)
    calculatedRecords.sort((a, b) => a.totalAmount - b.totalAmount);

    return NextResponse.json(
      {
        calculatedRecords,
        summary: {
          totalFamilyMembers: 1 + family.spouse.length + family.children.length,
          mainInsured: true,
          spouseCount: family.spouse.length,
          childrenCount: family.children.length,
          policiesCalculated: calculatedRecords.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating individual policy records:", error);
    return NextResponse.json(
      { error: "Error calculating individual policy records" },
      { status: 500 }
    );
  }
}

export async function createBulkIndividualRecord(
  req: NextRequest,
  userId: number,
  type: string
) {
  try {
    const {
      clientId,
      brokerId,
      state,
      selectedPolicies, // Array of CalculatedIndividualPolicyRecord
      issueDate,
    } = await req.json();

    if (
      !selectedPolicies ||
      selectedPolicies.length === 0 ||
      selectedPolicies.length > 6
    ) {
      return NextResponse.json(
        { error: "Select between 1 and 6 policies" },
        { status: 400 }
      );
    }

    if (!issueDate || !clientId) {
      return NextResponse.json(
        { error: "Issue date and client is required" },
        { status: 400 }
      );
    }

    const issueDateParsed = new Date(issueDate);

    if (isNaN(issueDateParsed.getTime())) {
      return NextResponse.json(
        { error: "Invalid issue date" },
        { status: 400 }
      );
    }

    const client = await prisma.user.findUnique({
      where: { id: clientId, type: { in: ["CLIENT", "USER"] } },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const effectiveBrokerId = type === "BROKER" ? userId : brokerId;

    const broker = await prisma.user.findUnique({
      where: {
        id: effectiveBrokerId,
        type: "BROKER",
      },
    });

    if (!broker) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }

    const record = await prisma.record.create({
      data: {
        clientId,
        brokerId: effectiveBrokerId,
        issueDate: issueDateParsed,
        state: state || "DRAFT",
        type: "Individual_Medical",
        policies: {
          create: selectedPolicies.map(
            (p: CalculatedIndividualPolicyRecord) => ({
              policyId: p.policyId,
              totalAmount: p.totalAmount,
              totalTaxed: p.totalTaxed,
              policyDescription: p.policyDescription,
              numberOfInsureds: p.numberOfInsureds,
              numberOfPersons: p.numberOfPersons,
              averageAge: p.averageAge,
              avgPricePerPerson: p.avgPricePerPerson,
            })
          ),
        },
      },
      include: {
        policies: {
          include: {
            policy: {
              include: {
                company: true,
              },
            },
          },
        },
        client: true,
        broker: true,
      },
    });

    await prisma.user.updateMany({
      where: {
        id: {
          in: [clientId, effectiveBrokerId],
        },
      },
      data: {
        clientCount: {
          increment: 1,
        },
        managedCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating bulk individual record:", error);
    return NextResponse.json(
      { error: "Error creating bulk individual record" },
      { status: 500 }
    );
  }
}
