export const recordsList = [{
  id: 1,
  totalAmount: 5000,
  state: "APPROVED",
  client: 'Omar Ali',
  agent:'John Doe',
  policyDescription: 'Full AXA SME',
  createdAt: '12/11/2025',
  updatedAt: '12/11/2025'
},
{
  id: 2,
  totalAmount: 4000,
  state: "APPROVED",
  client: 'Omar Ali',
  agent:'John Doe',
  policyDescription: 'Full GIG Health',
  createdAt: '12/11/2025',
  updatedAt: '12/11/2025'
},
{
  id: 3,
  totalAmount: 2000,
  state: "DRAFT",
  client: 'Omar Ali',
  agent:'John Doe',
  policyDescription: 'Full Allianz Car',
  createdAt: '12/11/2025',
  updatedAt: '12/11/2025'
}]

export const recordsColumns = [
  { name: "Id", key: "id", type: "text" },
  { name: "Total Amount", key: "totalAmount", type: "text" },
  { name: "State", key: "state", type: "text" },
  { name: "Client", key: "client", type: "text" },
  { name: "Agent", key: "agent", type: "text" },
  { name: "Policy Description", key: "policyDescription", type: "text" },
//   { name: "Created At", key: "createdAt", type: "text" },
  { name: "Updated At", key: "updatedAt", type: "text" },
]
