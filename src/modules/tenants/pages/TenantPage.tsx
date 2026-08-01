import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import AllTenantsPage from "./AllTenantsPage";

import { useNavigate } from "react-router-dom";

export default function TenantPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Tenant Management" },
          {label:"All Tenants"}
        ]}
        title="Tenants"
        description="All customer organizations subscribed to InternalOps."
        actions={
          <>
            <Button variant="outline">Export CSV</Button>
            <Button 
              onClick={() => navigate("/tenants/create")}
            >Create Tenant</Button>
          </>
        }
      />
      <section>
        <AllTenantsPage/>
      </section>
    </div>
)
}