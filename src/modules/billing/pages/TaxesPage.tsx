import { useBillingStore } from "../hooks/useBillingState";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function TaxesPage() {
  const { taxRates } = useBillingStore();

  const handleDelete = (id: string, name: string) => {
    useBillingStore.setState((state) => ({
      taxRates: state.taxRates.filter((tr) => tr.id !== id),
    }));
    toast.success(`Tax rate ${name} deleted successfully.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Tax rates</h3>
        <p className="text-xs text-slate-500 font-medium">Configured per region and product.</p>
      </div>

      {/* Tax Rates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxRates.map((tax) => (
          <div key={tax.id} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-sm transition flex flex-col justify-between group">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">{tax.country}</span>
                <button
                  onClick={() => handleDelete(tax.id, tax.name)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-1">{tax.country} — {tax.name}</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-normal">
                {tax.description || "Configured product rate"}
              </p>
            </div>

            {/* Percentage amount */}
            <div className="flex items-baseline mt-5 gap-0.5">
              <span className="text-2xl font-black text-slate-800">{tax.rate}</span>
              <span className="text-sm font-bold text-slate-500">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default TaxesPage;
