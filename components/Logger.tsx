import React, { useRef, useEffect } from 'react';
import { LogEntry, AgentRole } from '../types';
import { Bot, User, Film, Camera, Search, AlertCircle, BarChart2 } from 'lucide-react';
import { translations, Language } from '../translations';

interface LoggerProps {
  logs: LogEntry[];
  language: Language;
}

const getRoleIcon = (role: AgentRole) => {
  switch (role) {
    case AgentRole.DIRECTOR: return <Film size={14} className="text-purple-400" />;
    case AgentRole.SCREENWRITER: return <Bot size={14} className="text-blue-400" />;
    case AgentRole.CINEMATOGRAPHER: return <Camera size={14} className="text-orange-400" />;
    case AgentRole.REVIEWER: return <Search size={14} className="text-red-400" />;
    case AgentRole.STRATEGIST: return <BarChart2 size={14} className="text-green-400" />;
    default: return <User size={14} />;
  }
};

export const Logger: React.FC<LoggerProps> = ({ logs, language }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900 border-l border-slate-800 w-80 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Bot size={18} className="text-purple-500" />
          {t.logger.title}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {logs.length === 0 && (
          <div className="text-slate-500 text-center text-sm py-10 italic">
            {t.logger.waiting}
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              {getRoleIcon(log.role)}
              <span className={`text-xs font-bold uppercase tracking-wider ${
                log.role === AgentRole.DIRECTOR ? 'text-purple-400' :
                log.role === AgentRole.SCREENWRITER ? 'text-blue-400' :
                log.role === AgentRole.CINEMATOGRAPHER ? 'text-orange-400' :
                log.role === AgentRole.REVIEWER ? 'text-red-400' :
                'text-green-400'
              }`}>
                {log.role}
              </span>
              <span className="text-[10px] text-slate-500 ml-auto">
                {log.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className={`text-sm p-3 rounded-lg border ${
              log.type === 'error' ? 'bg-red-900/20 border-red-800 text-red-200' :
              log.type === 'success' ? 'bg-green-900/20 border-green-800 text-green-200' :
              'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
               {log.type === 'warning' && <AlertCircle size={14} className="inline mr-1 text-yellow-500"/>}
               {log.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
