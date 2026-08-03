import { Button } from "@/shared/components/ui/button";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { Download, FileSpreadsheet, Calendar } from "lucide-react";
import { toast } from "sonner";

export function RevenueReportsPage() {
  const handleExport = (reportName: string) => {
    toast.success(`Exporting ${reportName} to CSV spreadsheet...`);
  };

  const reportsList = [
    {
      name: "MRR Breakdown by Plan",
      desc: "Detailed subscription value sliced by Starter, Growth, Scale and Enterprise tiers.",
      icon: <FileSpreadsheet className="h-5 w-5 text-blue-600" />,
    },
    {
      name: "Annualized Growth Forecast",
      desc: "Rolling 12-month contract value extrapolation models including churn modifiers.",
      icon: <FileSpreadsheet className="h-5 w-5 text-indigo-600" />,
    },
    {
      name: "VAT & Sales Tax Filings Summary",
      desc: "Regional tax collected ledger matching US, EU, UK, IN and AU tax configurations.",
      icon: <FileSpreadsheet className="h-5 w-5 text-emerald-600" />,
    },
    {
      name: "Refunds and Adjustment Logs",
      desc: "Comprehensive ledger of credits, refunds, and adjustments sorted chronologically.",
      icon: <FileSpreadsheet className="h-5 w-5 text-rose-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Financial Revenue Reports</h3>
        <p className="text-xs text-slate-500 font-medium">Export raw audit ledger spreadsheets and run growth forecast models.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((report, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-sm transition"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
                {report.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">{report.name}</h4>
                <p className="text-xs text-slate-500 leading-normal max-w-sm">{report.desc}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl flex items-center gap-1 text-xs border-slate-200 text-slate-600 hover:text-slate-800 cursor-pointer"
              onClick={() => handleExport(report.name)}
            >
              <Download className="h-3 w-3" />
              CSV
            </Button>
          </div>
        ))}
      </div>

      {/* Audit Log Timeline block */}
      <ChartCard title="Audited Financial Closing Dates" description="Official ledger closing dates for platform taxation records.">
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Q2 Financial Ledger Closing</span>
            </div>
            <span className="text-slate-500">Ended June 30, 2026</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Q1 Financial Ledger Closing</span>
            </div>
            <span className="text-slate-500">Ended March 31, 2026</span>
          </div>
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>FY2025 Annual Financial Closing</span>
            </div>
            <span className="text-slate-500">Ended Dec 31, 2025</span>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
export default RevenueReportsPage;
