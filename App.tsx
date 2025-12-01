import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Logger } from './components/Logger';
import { SetupView, StrategyView, ScenesView, ProductionView, ViralCheckView } from './components/StepViews';
import { ProjectSettings, Character, Scene, Script, LogEntry, AgentRole, ViralAnalysis } from './types';
import { generateStrategy, generateScenePlan, generateDialogueAndAction, generateShots, runViralCheck } from './services/geminiService';
import { Globe } from 'lucide-react';
import { translations, Language } from './translations';

const initialSettings: ProjectSettings = {
  topic: '',
  targetAudience: '',
  styleTemplate: '',
  emotionNeed: '',
  memoryPoint: ''
};

export default function App() {
  // Language State
  const [language, setLanguage] = useState<Language>('zh');
  const t = translations[language];

  // App State
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<ProjectSettings>(initialSettings);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [viralAnalysis, setViralAnalysis] = useState<ViralAnalysis | null>(null);
  
  // Loading States
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [processingProduction, setProcessingProduction] = useState(false);
  const [productionStatus, setProductionStatus] = useState<{ type: 'processing' | 'complete' | 'idle', id?: number }>({ type: 'idle' });
  const [loadingViral, setLoadingViral] = useState(false);

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (role: AgentRole, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      role,
      message,
      type
    }]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  // --- Handlers ---

  const handleGenerateStrategy = async () => {
    setLoadingStrategy(true);
    addLog(AgentRole.STRATEGIST, `Analyzing topic: "${settings.topic}"...`);
    try {
      const result = await generateStrategy(settings.topic);
      setSettings(prev => ({ ...prev, ...result }));
      addLog(AgentRole.STRATEGIST, "Strategy defined successfully.", 'success');
    } catch (error) {
      addLog(AgentRole.STRATEGIST, "Failed to generate strategy. check API Key.", 'error');
    } finally {
      setLoadingStrategy(false);
    }
  };

  const handleGenerateScenes = async () => {
    setLoadingScenes(true);
    addLog(AgentRole.DIRECTOR, "Planning scenes with conflict hooks...", 'info');
    try {
      const generatedScenes = await generateScenePlan(settings.topic, settings, characters);
      setScenes(generatedScenes);
      addLog(AgentRole.DIRECTOR, `Generated ${generatedScenes.length} scenes.`, 'success');
    } catch (error) {
      addLog(AgentRole.DIRECTOR, "Failed to plan scenes.", 'error');
    } finally {
      setLoadingScenes(false);
    }
  };

  const handleProductionLoop = async () => {
    setProcessingProduction(true);
    const updatedScenes = [...scenes];

    for (let i = 0; i < updatedScenes.length; i++) {
      const scene = updatedScenes[i];
      setProductionStatus({ type: 'processing', id: scene.id });
      
      // Step 1: Screenwriter (Dialogue + Action)
      addLog(AgentRole.SCREENWRITER, `Writing dialogue for Scene ${scene.id} (${scene.location})...`, 'info');
      try {
        const dialogues = await generateDialogueAndAction(scene, characters);
        scene.dialogues = dialogues;
        addLog(AgentRole.SCREENWRITER, `Drafted ${dialogues.length} lines for Scene ${scene.id}.`, 'success');

        // Step 2: Cinematographer (Shots)
        addLog(AgentRole.CINEMATOGRAPHER, `Designing shots for Scene ${scene.id}...`, 'info');
        const dialoguesWithShots = await generateShots(dialogues, settings.styleTemplate);
        scene.dialogues = dialoguesWithShots;
        addLog(AgentRole.CINEMATOGRAPHER, `Shots assigned for Scene ${scene.id}.`, 'success');

        // Update state progressively
        updatedScenes[i] = scene;
        setScenes([...updatedScenes]); // Trigger re-render
      } catch (err) {
        addLog(AgentRole.DIRECTOR, `Production failed at Scene ${scene.id}`, 'error');
      }
    }

    setProcessingProduction(false);
    setProductionStatus({ type: 'complete' });
  };

  const handleViralCheck = async () => {
    setLoadingViral(true);
    addLog(AgentRole.REVIEWER, "Running blockbuster simulation...", 'warning');
    try {
      const script: Script = { title: settings.topic, scenes };
      const analysis = await runViralCheck(script);
      setViralAnalysis(analysis);
      addLog(AgentRole.REVIEWER, "Analysis complete.", 'success');
    } catch (error) {
      addLog(AgentRole.REVIEWER, "Analysis failed.", 'error');
    } finally {
      setLoadingViral(false);
    }
  };

  // --- Render ---

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar currentStep={currentStep} setStep={setCurrentStep} language={language} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
               {t.steps[currentStep as keyof typeof t.steps]}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
             >
               <Globe size={14} />
               {language === 'zh' ? 'EN' : '中文'}
             </button>

             {!process.env.API_KEY && (
               <div className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold border border-red-200">
                 {t.common.apiKeyMissing}
               </div>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           {currentStep === 0 && (
             <SetupView 
               settings={settings} 
               setSettings={setSettings} 
               characters={characters} 
               setCharacters={setCharacters}
               onNext={() => setCurrentStep(1)}
               language={language}
             />
           )}
           {currentStep === 1 && (
             <StrategyView
               settings={settings}
               isLoading={loadingStrategy}
               onGenerate={handleGenerateStrategy}
               onNext={() => setCurrentStep(2)}
               language={language}
             />
           )}
           {currentStep === 2 && (
             <ScenesView
               scenes={scenes}
               isLoading={loadingScenes}
               onGenerate={handleGenerateScenes}
               onNext={() => setCurrentStep(3)}
               language={language}
             />
           )}
           {currentStep === 3 && (
             <ProductionView
               scenes={scenes}
               isProcessing={processingProduction}
               status={productionStatus}
               onStartProduction={handleProductionLoop}
               onNext={() => setCurrentStep(4)}
               language={language}
             />
           )}
           {currentStep === 4 && (
             <ViralCheckView
               analysis={viralAnalysis}
               isLoading={loadingViral}
               onAnalyze={handleViralCheck}
               language={language}
             />
           )}
           {currentStep === 5 && (
             <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
                <h3 className="font-bold text-lg">{t.final.jsonTitle}</h3>
                <pre className="bg-slate-900 text-slate-300 p-6 rounded-xl overflow-auto text-xs font-mono max-h-[600px]">
                  {JSON.stringify({ settings, characters, scenes, viralAnalysis }, null, 2)}
                </pre>
             </div>
           )}
        </div>
      </main>

      <Logger logs={logs} language={language} />
    </div>
  );
}
