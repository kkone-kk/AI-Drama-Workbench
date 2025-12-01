import React from 'react';
import { LayoutDashboard, Users, Clapperboard, Video, BarChart2, CheckCircle2 } from 'lucide-react';
import { translations, Language } from '../translations';

interface SidebarProps {
  currentStep: number;
  setStep: (step: number) => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentStep, setStep, language }) => {
  const t = translations[language];

  const steps = [
    { id: 0, label: t.sidebar.setup, icon: Users },
    { id: 1, label: t.sidebar.strategy, icon: BarChart2 },
    { id: 2, label: t.sidebar.scenes, icon: LayoutDashboard },
    { id: 3, label: t.sidebar.production, icon: Clapperboard },
    { id: 4, label: t.sidebar.viralCheck, icon: CheckCircle2 },
    { id: 5, label: t.sidebar.finalScript, icon: Video },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-purple-600 text-white p-1 rounded">AI</span> Drama
        </h1>
        <p className="text-xs mt-1 text-slate-500">{t.subtitle}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setStep(step.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{step.label}</span>
              {currentStep > step.id && (
                <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        v1.0.0 • Gemini 2.5 Flash
      </div>
    </div>
  );
};
