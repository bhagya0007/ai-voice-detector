export type Language = 'Tamil' | 'English' | 'Hindi' | 'Malayalam' | 'Telugu';

export interface AudioPayload {
  language: Language;
  audioFormat: 'mp3';
  audioBase64: string;
}

export interface AnalysisResult {
  status: 'success' | 'error';
  language: Language;
  classification: 'AI_GENERATED' | 'HUMAN';
  confidenceScore: number;
  explanation: string;
  message?: string;
}

export type AppState = 'IDLE' | 'ANALYZING' | 'SUCCESS' | 'ERROR';