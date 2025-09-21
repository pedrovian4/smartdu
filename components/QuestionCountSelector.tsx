import { Target } from "lucide-react";

interface QuestionCountSelectorProps {
  questionCounts: number[];
  selectedCount: number;
  onCountChange: (count: number) => void;
}

export function QuestionCountSelector({ 
  questionCounts, 
  selectedCount, 
  onCountChange 
}: QuestionCountSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-rose-600" />
        <label className="text-sm font-semibold text-slate-700">
          Quantidade de Questões
        </label>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {questionCounts.map((count) => (
          <button
            key={count}
            onClick={() => onCountChange(count)}
            className={`p-4 rounded-2xl border transition-all duration-200 ${
              selectedCount === count
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <div className="font-semibold text-lg">{count}</div>
            <div className={`text-xs mt-1 ${
              selectedCount === count ? "text-rose-100" : "text-slate-500"
            }`}>questões</div>
          </button>
        ))}
      </div>
    </div>
  );
}