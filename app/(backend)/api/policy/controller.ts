import { prisma } from "../../_lib/prisma";


export async function createPolicy(data: any) {
  const { type, companyId, totalNetPremium, tax, carDetails, healthDetails } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Create the Base Policy
    const policy = await tx.policy.create({
      data: {
        type,
        companyId,
        totalNetPremium,
        tax,
        // 2. Conditionally create subtypes
        ...(type === 'CAR' && carDetails && {
          carPolicy: {
            create: carDetails,
          },
        }),
        ...((type === 'HEALTH' || type === 'SME') && healthDetails && {
          healthPolicy: {
            create: {
              ...healthDetails,
              // Handle nested pricing for health policies
              healthPricings: {
                create: healthDetails.healthPricings,
              },
            },
          },
        }),
      },
      include: {
        carPolicy: true,
        healthPolicy: {
          include: { healthPricings: true }
        },
      },
    });

    return policy;
  });
}