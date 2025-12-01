export enum AgentRole {
  DIRECTOR = 'Director',
  SCREENWRITER = 'Screenwriter',
  CINEMATOGRAPHER = 'Cinematographer',
  STRATEGIST = 'Strategist', // For Audience/Style
  REVIEWER = 'Viral Reviewer'
}

export interface ProjectSettings {
  topic: string;
  targetAudience: string;
  styleTemplate: string;
  emotionNeed: string;
  memoryPoint: string;
}

export interface Character {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  profile: string;
  signatureAction?: string; // New: Optimized prompt requirement
}

export interface Scene {
  id: number;
  location: string;
  description: string;
  conflict: string; // New: Optimized prompt requirement
  dialogues: DialogueLine[];
  viralScore?: number;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  action: string;
  emotion: string;
  shotType: string;
  isGoldenSentence?: boolean; // New: Optimized prompt requirement
}

export interface Script {
  title: string;
  scenes: Scene[];
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  role: AgentRole;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ViralAnalysis {
  hookStrength: string;
  emotionPeak: string;
  rhythmFit: string;
  memoryRepeat: string;
  spreadPotential: string;
}