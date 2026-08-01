import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/ui/DataTable";
import { mockInvoices, type TenantInvoice } from "../data/mockTabDetails";
import { type Tenant } from "../data/mockTenants";
import { useTenantStore } from "../data/tenantStore";

interface BillingDetailsProps {
  tenant: Tenant;
}

export default function BillingDetails({ tenant }: BillingDetailsProps) {
  const { updateTenant } = useTenantStore();
  const [name, setName] = useState(tenant.owner.name);
  const [email, setEmail] = useState(tenant.owner.email);
  const [taxId, setTaxId] = useState("");
  
  // Get invoices for the tenant, or default to a mock row
  const invoices = mockInvoices[tenant.id] || [
    {
      id: "INV-2026-4820",
      amount: `$${tenant.mrr}`,
      status: "Paid",
      issued: tenant.createdDate,
      due: "N/A",
    },
  ];

  useEffect(() => {
    setName(tenant.owner.name);
    setEmail(tenant.owner.email);
  }, [tenant]);

  const handleSave = () => {
    updateTenant(tenant.id, {
      owner: {
        name,
        email,
      },
    });
    alert("Billing contact updated successfully!");
  };

  const handleReset = () => {
    setName(tenant.owner.name);
    setEmail(tenant.owner.email);
    setTaxId("");
  };

  const invoiceColumns = [
    {
      key: "id",
      header: "Invoice",
      className: "font-medium text-slate-800 text-sm",
    },
    {
      key: "amount",
      header: "Amount",
      className: "text-slate-700 text-sm",
    },
    {
      key: "status",
      header: "Status",
      render: (row: TenantInvoice) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === "Paid"
            ? "bg-emerald-100 text-emerald-700"
            : row.status === "Pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-red-100 text-red-700"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${
            row.status === "Paid"
              ? "bg-emerald-500"
              : row.status === "Pending"
              ? "bg-amber-500"
              : "bg-red-500"
          }`} />
          {row.status}
        </span>
      ),
    },
    {
      key: "issued",
      header: "Issued",
      className: "text-slate-700 text-sm",
    },
    {
      key: "due",
      header: "Due",
      className: "text-slate-700 text-sm",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      {/* ================= LEFT SECTION ================= */}
      <Card className="lg:col-span-2 shadow-xs rounded-2xl border-slate-200">
        <CardContent className="p-6 space-y-8">
          
          {/* Current Plan Section */}
          <div>
            <h2 className="text-base font-semibold text-slate-900">Current plan</h2>
            <p className="text-xs text-slate-500 mb-4">Renews on the 1st of every month</p>

            <div className="border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{tenant.plan}</h3>
                <p className="text-sm text-slate-500 mt-0.5">${tenant.mrr} / month</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-slate-50 border-slate-200 shadow-none font-medium text-slate-700 cursor-pointer"
                >
                  Change plan
                </Button>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-slate-50 border-slate-200 shadow-none font-medium text-slate-700 cursor-pointer"
                >
                  Apply coupon
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Invoices Section */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-4">Recent invoices</h2>
            
            <DataTable<TenantInvoice>
              data={invoices}
              columns={invoiceColumns}
              rowKey={(row) => row.id}
              selectable={true}
              searchable={true}
              searchPlaceholder="Search invoices..."
              searchFields={["id", "amount", "status"]}
              showColumnsButton={true}
              showExportButton={true}
              pageSize={5}
            />
          </div>

        </CardContent>
      </Card>

      {/* ================= RIGHT SECTION: BILLING CONTACT ================= */}
      <Card className="shadow-xs rounded-2xl border-slate-200 h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">
            Billing contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-800 block">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-800 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Tax ID Field */}
          <div className="space-y-1.5">
            <label htmlFor="tax-id" className="text-sm font-medium text-slate-800 block">
              Tax ID
            </label>
            <input
              id="tax-id"
              type="text"
              placeholder="VAT / EIN"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-white border-slate-200 text-slate-700 shadow-none cursor-pointer"
            >
              Reset
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-[#1e293b] hover:bg-[#0f172a] text-white shadow-none cursor-pointer"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}