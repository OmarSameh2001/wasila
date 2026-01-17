// these are the fields that we want to allow filtering on
const modelFields: Record<string, Record<string, string>> = {
  user: {
    id: "number",
    name: "string",
    username: "string",
    email: "string",
    type: "string",
    emailVerified: "boolean",
    managedCount: "number",
    clientCount: "number",
    brokerId: "number",
  },
  record: {
    id: "number",
    totalAmount: "number",
    state: "string",
    clientId: "number",
    userId: "number",
    policyId: "number",
  },
  company: {
    id: "number",
    name: "string",
    address: "string",
  },
  policy: {
    id: "number",
    type: "string",
    companyId: "number",
    tax: "number",
    brokerId: "number",
    name: "string",
  },
  //   CarPolicy: new Set(['id', 'ownDamage', 'thirdParty', 'fire', 'theft', 'make', 'model', 'year', 'mileage', 'policyId']),
  //   HealthPolicy: new Set(['id', 'lifeInsurance', 'totalPermanentDisability', 'accidentalDeath', 'partialPermanentDisability', 'medicalTpa', 'network', 'areaOfCoverage', 'annualCeilingPerPerson', 'inPatientAccommodation', 'icu', 'parentAccommodation', 'doctorConsultation', 'labScan', 'physiotherapy', 'medication', 'dental', 'optical', 'maternityLimit', 'newbornCeiling', 'preExistingCases', 'newChronic', 'organTransplant', 'groundAmbulance', 'reimbursementCoverage', 'numberOfInsuredMembers', 'averagePremiumPerHead', 'policyId']),
  //   HealthPricing: new Set(['id', 'minAge', 'maxAge', 'mainPrice', 'dependentPrice', 'healthId']),
};
export default modelFields;

const operatorMap: Record<string, string> = {
  gt: "gt",
  gte: "gte",
  lt: "lt",
  lte: "lte",
  contains: "contains",
  startsWith: "startsWith",
  endsWith: "endsWith",
};

function parseKey(key: string): [string, string?] {
  // Split key like "totalAmount_gt" -> ["totalAmount", "gt"]
  const parts = key.split("_");

  if (parts.length > 1) {
    const op = operatorMap[parts[1]];
    return [parts[0], op];
  }
  return [key];
}

export function castParam(modelName: string, key: string, value: string) {
  // console.log(modelName, key, value);
  const [field, operator] = parseKey(key);
  if (!modelFields[modelName]?.[field]) return null;

  const type = modelFields[modelName][field];

  let casted: any;
  switch (type) {
    case "number":
      casted = value === "null" ? null : parseFloat(value);
      break;
    case "boolean":
      casted = value === "true" || value === "1";
      break;
    case "string":
      casted = value === "null" ? null : value;
      break;
    case "date":
      casted = new Date(value);
      break;
    default:
      return null;
  }
  // console.log(casted, operator, field, type);
  if (operator === "contains")
    return { [field]: { contains: casted, mode: "insensitive" } };
  if (operator) return { [field]: { [operator]: casted } };
  return { [field]: casted };
}
