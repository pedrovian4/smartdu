import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, Play, CheckCircle, Award, Users } from "lucide-react";

interface QuizSummaryProps {
  selectedQuestionCount: number;
  selectedYears: number[];
  selectedDisciplines: string[];
  onStartQuiz: () => void;
  isDisabled: boolean;
}

export function QuizSummary({ 
  selectedQuestionCount,
  selectedYears,
  selectedDisciplines,
  onStartQuiz,
  isDisabled
}: QuizSummaryProps) {
  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <Card className="border border-slate-200 bg-rose-500 text-white">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <Trophy className="h-6 w-6" />
            Resumo do Simulado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Target className="h-6 w-6 text-rose-200 mt-1" />
            <div>
              <div className="font-semibold text-lg">{selectedQuestionCount} questões</div>
              <div className="text-sm text-rose-200">Selecionadas para o teste</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-rose-200 mt-1" />
            <div>
              <div className="font-semibold text-lg">~{Math.ceil(selectedQuestionCount * 2.5)} minutos</div>
              <div className="text-sm text-rose-200">Tempo estimado</div>
            </div>
          </div>
          <div className="pt-4 border-t border-rose-400/30">
            <div className="text-base text-rose-100">
              {selectedYears.length} {selectedYears.length === 1 ? "ano" : "anos"} • {selectedDisciplines.length} {selectedDisciplines.length === 1 ? "área" : "áreas"} selecionadas
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button
        onClick={onStartQuiz}
        disabled={isDisabled}
        className="w-full h-16 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 border-0 rounded-2xl transition-colors duration-200 disabled:opacity-50"
      >
        <Play className="h-6 w-6 mr-3" />
        Iniciar Simulado
      </Button>

      {/* Features */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-6">
          <CardTitle className="text-lg text-slate-900 flex items-center gap-3 font-semibold">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
            Recursos Inclusos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4 text-base text-slate-700">
            <Clock className="h-5 w-5 text-emerald-500" />
            <span>Timer automático durante o teste</span>
          </div>
          <div className="flex items-center gap-4 text-base text-slate-700">
            <Target className="h-5 w-5 text-violet-500" />
            <span>Feedback imediato das respostas</span>
          </div>
          <div className="flex items-center gap-4 text-base text-slate-700">
            <Award className="h-5 w-5 text-amber-500" />
            <span>Relatório de desempenho</span>
          </div>
          <div className="flex items-center gap-4 text-base text-slate-700">
            <Users className="h-5 w-5 text-rose-500" />
            <span>Acesso gratuito e ilimitado</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}