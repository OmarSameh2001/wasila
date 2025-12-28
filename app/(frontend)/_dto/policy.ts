import { companiesList } from "./company";

export const policiesList = [
  {
    id: 1,
    type: "CAR",
    name: 'Full',
    company: companiesList[0].name,
    tax: 0.2,
    brokerId: 1,
    records: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    type: "HEALTH",
    name: 'General',
    company: companiesList[1].name,
    tax: 0.1,
    brokerId: 2,
    records: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    type: "SME",
    name: 'Full',
    company: companiesList[2].name,
    tax: 0.1,
    brokerId: 3,
    records: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
export const policyColumns: any[] = [
  {
    name: "Id",
    key: "id",
    type: "text",
  },
  {
    name: "Type",
    key: "type",
    type: "text",
  },
  {
    name: "Name",
    key: "name",
    type: "text",
  },
  {
    name: "Company",
    key: "company",
    type: "text",
  },
  {
    name: "Tax",
    key: "tax",
    type: "text",
  },
  // {
  //   name: "Broker",
  //   key: "broker",
  //   type: "text",
  // },
  // {
  //   name: "Actions",
  //   key: "actions",
  //   type: "actions",
  //   actions: [
  //     {
  //       name: "View",
  //       icon: "eye",
  //       color: "blue",
  //       onClick: (id: number) => {
  //         console.log("View policy", id);
  //       },
  //     },
  //   ],
  // },
];
