export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: string;
  status: "Active" | "Trial" | "Suspended";
  users: number;
  mrr: number;
  storageUsed: number;
  storageLimit: number;
  region: string;
  createdDate: string;
  owner: {
    name: string;
    email: string;
  };
  modules: {
    HR: boolean;
    Finance: boolean;
    CRM: boolean;
    Inventory: boolean;
    Projects: boolean;
    Docs: boolean;
    Analytics: boolean;
  };
}

export const initialTenants: Tenant[] = [
  {
    id: "northwind-labs",
    name: "Northwind Labs",
    domain: "northwindlabs.internalops.app",
    plan: "Growth",
    status: "Active",
    users: 163,
    mrr: 695,
    storageUsed: 98.6,
    storageLimit: 200,
    region: "eu-west",
    createdDate: "8/11/2025",
    owner: {
      name: "Northwind Admin",
      email: "admin@northwindlabs.com",
    },
    modules: {
      HR: false,
      Finance: false,
      CRM: false,
      Inventory: false,
      Projects: true,
      Docs: true,
      Analytics: true,
    },
  },
  {
    id: "acme-industrial",
    name: "Acme Industrial",
    domain: "acmeindustrial.internalops.app",
    plan: "Growth",
    status: "Trial",
    users: 182,
    mrr: 704,
    storageUsed: 108.1,
    storageLimit: 200,
    region: "us-east",
    createdDate: "9/15/2025",
    owner: {
      name: "Acme Admin",
      email: "admin@acmeindustrial.com",
    },
    modules: {
      HR: true,
      Finance: false,
      CRM: true,
      Inventory: false,
      Projects: false,
      Docs: true,
      Analytics: false,
    },
  },
  {
    id: "vector-freight",
    name: "Vector Freight",
    domain: "vectorfreight.internalops.app",
    plan: "Growth",
    status: "Trial",
    users: 202,
    mrr: 714,
    storageUsed: 117.7,
    storageLimit: 200,
    region: "us-west",
    createdDate: "10/01/2025",
    owner: {
      name: "Vector Admin",
      email: "admin@vectorfreight.com",
    },
    modules: {
      HR: true,
      Finance: true,
      CRM: false,
      Inventory: true,
      Projects: true,
      Docs: false,
      Analytics: true,
    },
  },
  {
    id: "contoso-ltd",
    name: "Contoso Ltd",
    domain: "contoso.internalops.app",
    plan: "Enterprise",
    status: "Active",
    users: 450,
    mrr: 1500,
    storageUsed: 180.5,
    storageLimit: 500,
    region: "eu-central",
    createdDate: "5/20/2025",
    owner: {
      name: "Contoso Admin",
      email: "admin@contoso.com",
    },
    modules: {
      HR: true,
      Finance: true,
      CRM: true,
      Inventory: true,
      Projects: true,
      Docs: true,
      Analytics: true,
    },
  },
  {
    id: "stark-industries",
    name: "Stark Industries",
    domain: "stark.internalops.app",
    plan: "Enterprise",
    status: "Suspended",
    users: 85,
    mrr: 450,
    storageUsed: 198.2,
    storageLimit: 200,
    region: "us-east",
    createdDate: "2/14/2025",
    owner: {
      name: "Tony Stark",
      email: "pepper@stark.com",
    },
    modules: {
      HR: false,
      Finance: true,
      CRM: false,
      Inventory: true,
      Projects: false,
      Docs: false,
      Analytics: true,
    },
  },
];
