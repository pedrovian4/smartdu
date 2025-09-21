import { Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface YearSelectorProps {
  availableYears: number[];
  selectedYears: number[];
  onYearToggle: (year: number) => void;
}

export function YearSelector({ 
  availableYears, 
  selectedYears, 
  onYearToggle 
}: YearSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-violet-600" />
        <label className="text-sm font-semibold text-slate-700">
          Anos das Provas
        </label>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {availableYears.map((year) => (
          <div 
            key={year} 
            className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <Checkbox
              id={`year-${year}`}
              checked={selectedYears.includes(year)}
              onCheckedChange={() => onYearToggle(year)}
              className="data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
            />
            <label
              htmlFor={`year-${year}`}
              className="text-sm font-medium cursor-pointer text-slate-700"
            >
              {year}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {selectedYears.map((year) => (
          <Badge key={year} className="px-3 py-1 bg-violet-500 text-white border-0 rounded-full">
            {year}
          </Badge>
        ))}
      </div>
    </div>
  );
}