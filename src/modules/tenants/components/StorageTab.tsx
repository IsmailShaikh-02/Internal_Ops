import { Card, CardContent } from "@/shared/components/ui/card";
import { type Tenant } from "../data/mockTenants";
import { Database, FileImage, Archive } from "lucide-react";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";

interface StorageTabProps {
  tenant: Tenant;
}

export default function StorageTab({ tenant }: StorageTabProps) {
  // Mock detailed storage allocation
  const dbUsed = +(tenant.storageUsed * 0.25).toFixed(1);
  const assetsUsed = +(tenant.storageUsed * 0.6).toFixed(1);
  const backupsUsed = +(tenant.storageUsed * 0.15).toFixed(1);

  const dbPercentage = Math.round((dbUsed / tenant.storageLimit) * 100);
  const assetsPercentage = Math.round((assetsUsed / tenant.storageLimit) * 100);
  const backupsPercentage = Math.round((backupsUsed / tenant.storageLimit) * 100);

  const storageItems = [
    { name: "Database storage", used: dbUsed, pct: dbPercentage, icon: <Database className="h-5 w-5 text-blue-600" />, desc: "PostgreSQL tables, indexes and relation schemas." },
    { name: "Media assets", used: assetsUsed, pct: assetsPercentage, icon: <FileImage className="h-5 w-5 text-emerald-600" />, desc: "Uploaded logos, PDFs, employee avatars and raw attachments." },
    { name: "System backups", used: backupsUsed, pct: backupsPercentage, icon: <Archive className="h-5 w-5 text-amber-600" />, desc: "Compressed nightlies, schema backups and transaction logs." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Storage Usage</h3>
        <p className="text-xs text-slate-500 mt-0.5">Understand how the storage quota is allocated across databases and file stores.</p>
      </div>

      {/* Main Quota Overview Card */}
      <Card className="border border-slate-200 shadow-xs rounded-xl overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Quota Allocated</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">{tenant.storageUsed} GB</span>
                <span className="text-sm text-slate-500">used of {tenant.storageLimit} GB</span>
              </div>
            </div>
            <StatusBadge variant={tenant.storageUsed / tenant.storageLimit > 0.85 ? "warning" : "success"} className="mt-2 sm:mt-0 font-medium">
              {Math.round((tenant.storageUsed / tenant.storageLimit) * 100)}% Used
            </StatusBadge>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${dbPercentage}%` }} title="Database" />
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${assetsPercentage}%` }} title="Media Assets" />
            <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${backupsPercentage}%` }} title="Backups" />
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />Database ({dbPercentage}%)</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Media assets ({assetsPercentage}%)</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />System backups ({backupsPercentage}%)</div>
          </div>
        </CardContent>
      </Card>

      {/* Detail breakdown list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storageItems.map((item) => (
          <div key={item.name} className="border border-slate-200 bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1">
                <span>{item.used} GB</span>
                <span>{item.pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: `${(item.used / tenant.storageLimit) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
