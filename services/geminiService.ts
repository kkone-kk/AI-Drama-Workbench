import { GoogleGenAI, Type } from "@google/genai";
import { PROMPTS } from '../constants';
import { ProjectSettings, Character, Scene, DialogueLine, ViralAnalysis } from '../types';

let ai: GoogleGenAI | null = null;

const initAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// Helper to sanitize JSON string if Markdown code blocks are present
const extractJSON = (text: string) => {
  const jsonMatch = text.match(/```json([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  const jsonMatch2 = text.match(/```([\s\S]*?)```/); 
    if (jsonMatch2) {
    return jsonMatch2[1].trim();
  }
  return text.trim();
};

export const generateStrategy = async (topic: string): Promise<Partial<ProjectSettings>> => {
  const client = initAI();
  if (!client) throw new Error("API Key missing");

  const prompt = PROMPTS.STRATEGY_AUDIENCE.replace('{{TOPIC}}', topic);
  
  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  try {
    const data = JSON.parse(extractJSON(response.text));
    return {
      targetAudience: data.audience,
      emotionNeed: data.emotion_need,
      styleTemplate: data.style_template,
      memoryPoint: data.memory_point
    };
  } catch (e) {
    console.error("Failed to parse strategy", e);
    throw new Error("Failed to generate strategy JSON");
  }
};

export const generateScenePlan = async (
  topic: string,
  settings: ProjectSettings,
  characters: Character[]
): Promise<Scene[]> => {
  const client = initAI();
  if (!client) throw new Error("API Key missing");

  let prompt = PROMPTS.DIRECTOR_SCENE_PLAN.replace('{{TOPIC}}', topic);
  prompt = prompt.replace('{{STRATEGY_JSON}}', JSON.stringify(settings));
  prompt = prompt.replace('{{CHARACTERS_JSON}}', JSON.stringify(characters));

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  try {
    const data = JSON.parse(extractJSON(response.text));
    return data.scenes.map((s: any) => ({ ...s, dialogues: [] }));
  } catch (e) {
    console.error("Failed to parse scenes", e);
    throw new Error("Failed to generate scene plan");
  }
};

export const generateDialogueAndAction = async (
  scene: Scene,
  characters: Character[]
): Promise<DialogueLine[]> => {
  const client = initAI();
  if (!client) throw new Error("API Key missing");

  let prompt = PROMPTS.SCREENWRITER_DIALOGUE.replace('{{SCENE_JSON}}', JSON.stringify(scene));
  prompt = prompt.replace('{{CHARACTERS_JSON}}', JSON.stringify(characters));
  
  const signatureActions = characters.map(c => `${c.name}: ${c.signatureAction || 'None'}`).join(', ');
  prompt = prompt.replace('{{SIGNATURE_ACTIONS}}', signatureActions);

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  try {
    const data = JSON.parse(extractJSON(response.text));
    return data.dialogues;
  } catch (e) {
     console.error("Failed to parse dialogue", e);
     throw new Error("Failed to generate dialogue");
  }
};

export const generateShots = async (
  dialogues: DialogueLine[],
  style: string
): Promise<DialogueLine[]> => {
  const client = initAI();
  if (!client) throw new Error("API Key missing");

  let prompt = PROMPTS.CINEMATOGRAPHER_SHOTS.replace('{{DIALOGUE_JSON}}', JSON.stringify(dialogues));
  prompt = prompt.replace('{{STYLE}}', style);

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  try {
    const data = JSON.parse(extractJSON(response.text));
    // Merge shot types back into dialogues
    return dialogues.map((d, i) => ({
      ...d,
      shotType: data.shots[i]?.shotType || 'Medium Shot'
    }));
  } catch (e) {
     console.error("Failed to parse shots", e);
     throw new Error("Failed to generate shots");
  }
};

export const runViralCheck = async (script: any): Promise<ViralAnalysis> => {
  const client = initAI();
  if (!client) throw new Error("API Key missing");

  let prompt = PROMPTS.VIRAL_CHECK.replace('{{SCRIPT_JSON}}', JSON.stringify(script));

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  try {
    return JSON.parse(extractJSON(response.text));
  } catch (e) {
    console.error("Failed to parse viral check", e);
    throw new Error("Failed to run viral check");
  }
};