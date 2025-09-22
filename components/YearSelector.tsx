import { Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <ScrollArea className="h-64 sm:h-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {availableYears.map((year) => (
            <div
              key={year}
              className="flex items-center space-x-2 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              <Checkbox
                id={`year-${year}`}
                checked={selectedYears.includes(year)}
                onCheckedChange={() => onYearToggle(year)}
                className="data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
              />
              <label
                htmlFor={`year-${year}`}
                className="text-sm font-medium cursor-pointer text-slate-700 px-2"
              >
                {year}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedYears.map((year) => (
          <Badge key={year} className="px-2 py-1 bg-violet-500 text-white border-0 rounded-full text-xs">
            {year}
          </Badge>
        ))}
      </div>
    </div>
  );
}
