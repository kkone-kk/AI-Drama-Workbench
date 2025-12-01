import React, { useState } from 'react';
import { ProjectSettings, Character, Scene, DialogueLine, ViralAnalysis } from '../types';
import { Plus, Trash2, Edit2, Play, CheckCircle, AlertTriangle, Sparkles, Video, User, BarChart2 } from 'lucide-react';
import { translations, Language } from '../translations';

// --- Step 0: Setup ---
export const SetupView: React.FC<{
  settings: ProjectSettings;
  setSettings: (s: ProjectSettings) => void;
  characters: Character[];
  setCharacters: (c: Character[]) => void;
  onNext: () => void;
  language: Language;
}> = ({ settings, setSettings, characters, setCharacters, onNext, language }) => {
  const [newCharName, setNewCharName] = useState('');
  const t = translations[language];
  
  const addCharacter = () => {
    if (!newCharName) return;
    setCharacters([...characters, { name: newCharName, gender: 'Other', profile: '', signatureAction: '' }]);
    setNewCharName('');
  };

  const updateCharacter = (index: number, field: keyof Character, value: string) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], [field]: value };
    setCharacters(updated);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
          <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          {t.setup.title}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.setup.topicLabel}</label>
            <textarea
              className="w-full border border-slate-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder={t.setup.topicPlaceholder}
              value={settings.topic}
              onChange={(e) => setSettings({ ...settings, topic: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
           <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
           {t.setup.castTitle}
        </h2>
        <div className="grid gap-4 mb-4">
          {characters.map((char, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <button 
                onClick={() => {
                  const n = characters.filter((_, i) => i !== idx);
                  setCharacters(n);
                }}
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title={t.setup.delete}
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500">{t.setup.name}</label>
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => updateCharacter(idx, 'name', e.target.value)}
                    className="w-full font-semibold bg-transparent border-b border-slate-300 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.setup.gender}</label>
                  <select
                    value={char.gender}
                    onChange={(e) => updateCharacter(idx, 'gender', e.target.value as any)}
                    className="w-full bg-transparent border-b border-slate-300 outline-none"
                  >
                    <option value="Male">{t.setup.male}</option>
                    <option value="Female">{t.setup.female}</option>
                    <option value="Other">{t.setup.other}</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-500">{t.setup.profile}</label>
                  <input
                     type="text"
                     value={char.profile}
                     onChange={(e) => updateCharacter(idx, 'profile', e.target.value)}
                     className="w-full bg-transparent border-b border-slate-300 outline-none text-sm"
                     placeholder={t.setup.profile}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCharName}
            onChange={(e) => setNewCharName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCharacter()}
            placeholder={t.setup.newCharPlaceholder}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
          />
          <button onClick={addCharacter} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-1">
            <Plus size={16} /> {t.setup.add}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onNext}
          disabled={!settings.topic || characters.length === 0}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-purple-200"
        >
          {t.setup.next} <Play size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Step 1: Strategy ---
export const StrategyView: React.FC<{
  settings: ProjectSettings;
  isLoading: boolean;
  onGenerate: () => void;
  onNext: () => void;
  language: Language;
}> = ({ settings, isLoading, onGenerate, onNext, language }) => {
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">{t.strategy.title}</h2>
          <p className="text-purple-200 mb-6 max-w-xl">
            {t.strategy.desc}
          </p>
          {!settings.targetAudience ? (
            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 flex items-center gap-2 transition-transform active:scale-95"
            >
              {isLoading ? (
                <span className="animate-pulse">{t.strategy.analyzing}</span>
              ) : (
                <>
                  <Sparkles size={18} /> {t.strategy.analyzeBtn}
                </>
              )}
            </button>
          ) : (
             <div className="flex items-center gap-3 text-green-300">
               <CheckCircle size={20} /> {t.strategy.generated}
             </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {settings.targetAudience && (
        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
           <StrategyCard title={t.strategy.targetAudience} value={settings.targetAudience} color="border-l-blue-500" />
           <StrategyCard title={t.strategy.emotionNeed} value={settings.emotionNeed} color="border-l-pink-500" />
           <StrategyCard title={t.strategy.styleTemplate} value={settings.styleTemplate} color="border-l-purple-500" />
           <StrategyCard title={t.strategy.memoryPoint} value={settings.memoryPoint} color="border-l-yellow-500" />
        </div>
      )}

      {settings.targetAudience && (
        <div className="flex justify-end pt-4">
           <button 
            onClick={onNext}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2 shadow-lg"
          >
            {t.strategy.next} <Play size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const StrategyCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div className={`bg-white p-5 rounded-lg shadow-sm border border-slate-100 border-l-4 ${color}`}>
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{title}</h3>
    <p className="text-slate-800 font-medium">{value}</p>
  </div>
);

// --- Step 2: Scenes ---
export const ScenesView: React.FC<{
  scenes: Scene[];
  isLoading: boolean;
  onGenerate: () => void;
  onNext: () => void;
  language: Language;
}> = ({ scenes, isLoading, onGenerate, onNext, language }) => {
  const t = translations[language];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-slate-900">{t.scenes.title}</h2>
           <p className="text-slate-500 text-sm">{t.scenes.desc}</p>
         </div>
         {scenes.length === 0 ? (
           <button
            onClick={onGenerate}
            disabled={isLoading}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
           >
             {isLoading ? <span className="animate-spin">⌛</span> : <Video size={18} />}
             {t.scenes.generateBtn}
           </button>
         ) : (
            <button onClick={onGenerate} className="text-purple-600 text-sm hover:underline">{t.scenes.regenerate}</button>
         )}
       </div>

       <div className="space-y-4">
         {scenes.map((scene) => (
           <div key={scene.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">{t.scenes.sceneLabel} {scene.id}</span>
                  <span className="font-semibold text-slate-700">{scene.location}</span>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200">
                  {scene.conflict || t.scenes.interaction}
                </span>
              </div>
              <p className="text-slate-600 mb-3 text-sm">{scene.description || t.scenes.descPlaceholder}</p>
              
              {/* Placeholder for dialogues if generated later */}
              {scene.dialogues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
                    <CheckCircle size={12} /> {t.scenes.dialoguesReady}
                  </div>
                  <div className="text-xs text-slate-400">
                    {scene.dialogues.length} {t.scenes.linesGenerated}
                  </div>
                </div>
              )}
           </div>
         ))}
       </div>

       {scenes.length > 0 && (
          <div className="flex justify-end pt-4">
             <button 
              onClick={onNext}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2 shadow-lg"
            >
              {t.scenes.next} <Play size={16} />
            </button>
          </div>
       )}
    </div>
  );
};

// --- Step 3: Production (Dialogue/Shots) ---
export const ProductionView: React.FC<{
  scenes: Scene[];
  isProcessing: boolean;
  status: { type: 'processing' | 'complete' | 'idle', id?: number };
  onStartProduction: () => void;
  onNext: () => void;
  language: Language;
}> = ({ scenes, isProcessing, status, onStartProduction, onNext, language }) => {
  const t = translations[language];
  const allDone = scenes.every(s => s.dialogues.length > 0 && s.dialogues[0].shotType);

  let statusText = '';
  if (status.type === 'processing' && status.id) {
    statusText = `${t.production.processing} ${t.scenes.sceneLabel} ${status.id}...`;
  } else if (status.type === 'complete') {
    statusText = t.production.complete;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
       <div className="flex items-center justify-between shrink-0">
         <div>
           <h2 className="text-2xl font-bold text-slate-900">{t.production.title}</h2>
           <p className="text-slate-500 text-sm">{t.production.desc}</p>
         </div>
         {!allDone && !isProcessing && (
           <button
            onClick={onStartProduction}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 shadow-md"
           >
             <Sparkles size={18} /> {t.production.startBtn}
           </button>
         )}
       </div>

       {isProcessing && (
         <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center gap-3 shrink-0">
           <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-blue-800 font-medium">{statusText}</span>
         </div>
       )}

       <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {scenes.map((scene) => (
            <div key={scene.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                 <h3 className="font-bold text-slate-700 text-sm">{t.scenes.sceneLabel} {scene.id} - {scene.location}</h3>
                 <span className="text-xs text-slate-400">{scene.dialogues.length > 0 ? t.production.completed : t.production.pending}</span>
              </div>
              
              {scene.dialogues.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm italic">
                  {t.production.awaiting}
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-500 font-medium">
                    <tr>
                      <th className="p-3 w-32">{t.production.tableShot}</th>
                      <th className="p-3 w-32">{t.production.tableChar}</th>
                      <th className="p-3">{t.production.tableDialogue}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scene.dialogues.map((line, idx) => (
                      <tr key={idx} className={`hover:bg-slate-50 ${line.isGoldenSentence ? 'bg-yellow-50/50' : ''}`}>
                         <td className="p-3 align-top">
                           <span className="inline-block bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-1">
                             {line.shotType || t.production.tbd}
                           </span>
                         </td>
                         <td className="p-3 align-top font-semibold text-slate-800">
                            {line.speaker}
                            <div className="text-[10px] font-normal text-slate-500 mt-1">{line.emotion}</div>
                         </td>
                         <td className="p-3 align-top">
                           {line.action && (
                             <div className="text-slate-500 italic mb-1 text-xs">
                               [{line.action}]
                             </div>
                           )}
                           <div className={line.isGoldenSentence ? 'font-bold text-slate-900' : 'text-slate-800'}>
                             {line.text}
                             {line.isGoldenSentence && <Sparkles size={12} className="inline ml-1 text-yellow-500" />}
                           </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
       </div>

       {allDone && (
          <div className="flex justify-end pt-4 shrink-0">
             <button 
              onClick={onNext}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2 shadow-lg"
            >
              {t.production.next} <CheckCircle size={16} />
            </button>
          </div>
       )}
    </div>
  );
};

// --- Step 4: Viral Check ---
export const ViralCheckView: React.FC<{
  analysis: ViralAnalysis | null;
  isLoading: boolean;
  onAnalyze: () => void;
  language: Language;
}> = ({ analysis, isLoading, onAnalyze, language }) => {
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in mt-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.viral.title}</h2>
        <p className="text-slate-500">{t.viral.desc}</p>
      </div>

      {!analysis ? (
         <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="mb-6 flex justify-center">
             <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
               <BarChart2 size={32} />
             </div>
           </div>
           <button
             onClick={onAnalyze}
             disabled={isLoading}
             className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
           >
             {isLoading ? t.viral.running : t.viral.runBtn}
           </button>
           <p className="mt-4 text-xs text-slate-400 max-w-sm mx-auto">
             {t.viral.details}
           </p>
         </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <ViralCard label={t.viral.hookStrength} value={analysis.hookStrength} score={90} />
          <ViralCard label={t.viral.emotionPeak} value={analysis.emotionPeak} score={85} />
          <ViralCard label={t.viral.rhythmFit} value={analysis.rhythmFit} score={88} />
          <ViralCard label={t.viral.memoryRepeat} value={analysis.memoryRepeat} score={92} />
          <div className="md:col-span-2 bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
             <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Sparkles /> {t.viral.spreadPotential}</h3>
             <p className="text-white/90">{analysis.spreadPotential}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ViralCard = ({ label, value, score }: { label: string, value: string, score: number }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-purple-50 transition-colors"></div>
    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">{label}</h4>
    <p className="text-slate-800 font-medium leading-relaxed">{value}</p>
  </div>
);
