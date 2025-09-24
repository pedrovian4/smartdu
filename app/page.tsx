"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { QuestionCountSelector } from "@/components/QuestionCountSelector";
import { YearSelector } from "@/components/YearSelector";
import { DisciplineSelector } from "@/components/DisciplineSelector";
import { QuizSummary } from "@/components/QuizSummary";

interface Discipline {
  label: string;
  value: string;
}

const availableYears = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009];

const disciplines: Discipline[] = [
  { label: "Ciências Humanas e suas Tecnologias", value: "ciencias-humanas" },
  { label: "Ciências da Natureza e suas Tecnologias", value: "ciencias-natureza" },
  { label: "Linguagens, Códigos e suas Tecnologias", value: "linguagens" },
  { label: "Matemática e suas Tecnologias", value: "matematica" }
];

const questionCounts = [3, 5, 8, 12, 15, 20, 25, 30, 45, 60];

export default function Home() {
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(8);
  const [selectedYears, setSelectedYears] = useState<number[]>([2023]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(["matematica"]);

  const handleYearToggle = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleDisciplineToggle = (discipline: string) => {
    setSelectedDisciplines(prev =>
      prev.includes(discipline)
        ? prev.filter(d => d !== discipline)
        : [...prev, discipline]
    );
  };

  const startQuiz = () => {
    const params = new URLSearchParams({
      count: selectedQuestionCount.toString(),
      years: selectedYears.join(','),
      disciplines: selectedDisciplines.join(',')
    });

    window.location.href = `/quiz?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <HeroSection />

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="border border-slate-200 bg-white">
              <CardHeader className="pb-4 sm:pb-6 lg:pb-8">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl text-slate-900 font-semibold">
                  <Settings className="h-6 w-6 sm:h-7 sm:w-7 text-rose-500" />
                  Configure seu Simulado
                </CardTitle>
                <p className="text-sm sm:text-base text-slate-600 mt-2 sm:mt-3 leading-relaxed">
                  Personalize sua experiência de estudos selecionando os parâmetros abaixo
                </p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 lg:space-y-8">
                <QuestionCountSelector
                  questionCounts={questionCounts}
                  selectedCount={selectedQuestionCount}
                  onCountChange={setSelectedQuestionCount}
                />

                <div className="border-t border-slate-100"></div>

                <YearSelector
                  availableYears={availableYears}
                  selectedYears={selectedYears}
                  onYearToggle={handleYearToggle}
                />

                <div className="border-t border-slate-100"></div>

                <DisciplineSelector
                  disciplines={disciplines}
                  selectedDisciplines={selectedDisciplines}
                  onDisciplineToggle={handleDisciplineToggle}
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="order-1 lg:order-2">
            <QuizSummary
              selectedQuestionCount={selectedQuestionCount}
              selectedYears={selectedYears}
              selectedDisciplines={selectedDisciplines}
              onStartQuiz={startQuiz}
              isDisabled={selectedDisciplines.length === 0 || selectedYears.length === 0}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20 text-slate-500 text-xs sm:text-sm px-4">
          <p>Totalmente gratuito • Questões oficiais do ENEM • Acesse quando quiser</p>
        </div>
      </div>

    </div>
  );
}
