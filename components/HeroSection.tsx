import { GraduationCap, BookOpen, Calendar, Award } from "lucide-react";
import { StatCard } from "./StatCard";

export function HeroSection() {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-6">
        <GraduationCap className="h-8 w-8 text-rose-500" />
        <h2 className="text-4xl font-bold text-slate-800">
          Prepare-se para o <span className="text-rose-500">ENEM</span>
        </h2>
      </div>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Acesse milhares de questões oficiais do ENEM e aprimore seus conhecimentos 
        com nossa plataforma de estudos inteligente
      </p>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
        <StatCard
          icon={BookOpen}
          value="+5000"
          title="Questões Disponíveis"
          subtitle="Todas as disciplinas"
          iconColor="text-emerald-500"
        />
        <StatCard
          icon={Calendar}
          value="15"
          title="Anos de Provas"
          subtitle="2009 até 2023"
          iconColor="text-violet-500"
        />
        <StatCard
          icon={Award}
          value="100%"
          title="Totalmente Gratuito"
          subtitle="Sem cadastro necessário"
          iconColor="text-amber-500"
        />
      </div>
    </div>
  );
}