import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  title: string;
  subtitle: string;
  iconColor: string;
}

export function StatCard({ icon: Icon, value, title, subtitle, iconColor }: StatCardProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Icon className={`h-10 w-10 ${iconColor}`} />
        <div className="text-4xl font-semibold text-slate-900">{value}</div>
      </div>
      <div className="text-base font-medium text-slate-700 text-center">{title}</div>
      <div className="text-sm text-slate-500 mt-2 text-center">{subtitle}</div>
    </div>
  );
}