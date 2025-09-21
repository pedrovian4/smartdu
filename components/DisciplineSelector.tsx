import { BookOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Discipline {
  label: string;
  value: string;
}

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  selectedDisciplines: string[];
  onDisciplineToggle: (discipline: string) => void;
}

export function DisciplineSelector({ 
  disciplines, 
  selectedDisciplines, 
  onDisciplineToggle 
}: DisciplineSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-amber-600" />
        <label className="text-sm font-semibold text-slate-700">
          Áreas de Conhecimento
        </label>
      </div>
      <div className="space-y-4">
        {disciplines.map((discipline) => (
          <div 
            key={discipline.value} 
            className="flex items-center space-x-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <Checkbox
              id={`discipline-${discipline.value}`}
              checked={selectedDisciplines.includes(discipline.value)}
              onCheckedChange={() => onDisciplineToggle(discipline.value)}
              className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <label
              htmlFor={`discipline-${discipline.value}`}
              className="text-base font-medium cursor-pointer flex-1 text-slate-700"
            >
              {discipline.label}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {selectedDisciplines.map((disciplineValue) => {
          const discipline = disciplines.find(d => d.value === disciplineValue);
          return (
            <Badge key={disciplineValue} className="px-3 py-1 bg-amber-500 text-white border-0 rounded-full">
              {discipline?.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}