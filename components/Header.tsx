import { Target, BarChart3, Users } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/image.png"
                alt="ENEM Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">SmartDU</h1>
                <p className="text-sm text-slate-500">Plataforma Educacional ENEM</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-500" />
              <span>Simulados</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-violet-500" />
              <span>Desempenho</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              <span>Comunidade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}