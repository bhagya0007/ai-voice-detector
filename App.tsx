import React, { useState } from 'react';
import { Activity, ShieldCheck, AlertTriangle, FileAudio, Settings, Play, Info } from 'lucide-react';
import { AudioUploader } from './components/AudioUploader';
import { ResultCard } from './components/ResultCard';
import { APIConfig } from './components/APIConfig';
import { Language, AnalysisResult, AppState } from './types';
import { fileToBase64 } from './utils';

const DEFAULT_API_URL = 'http://localhost:8000/api/voice-detection';
const MOCK_DELAY = 2000;

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<Language>('English');
  const [apiKey, setApiKey] = useState<string>('my-secret-key');
  const [apiUrl, setApiUrl] = useState<string>(DEFAULT_API_URL);
  const [useMock, setUseMock] = useState<boolean>(true);
  
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setAppState('ANALYZING');
    setError(null);
    setResult(null);

    try {
      const base64Audio = await fileToBase64(file);
      
      // Remove the data URL prefix (e.g., "data:audio/mpeg;base64,")
      const cleanBase64 = base64Audio.split(',')[1];

      if (useMock) {
        // Simulation for frontend demo purposes
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        const isAI = Math.random() > 0.5;
        // Generate a random float between 0.60 and 0.99
        const randomConfidence = 0.60 + Math.random() * 0.39;
        
        setResult({
          status: 'success',
          language: language,
          classification: isAI ? 'AI_GENERATED' : 'HUMAN',
          confidenceScore: parseFloat(randomConfidence.toFixed(4)),
          explanation: isAI 
            ? 'Detected unnatural spectral uniformity and lack of micro-tremors typically found in human vocal cords.' 
            : 'Natural breathing patterns, pitch jitter, and irregular spectral features indicative of human speech detected.'
        });
      } else {
        // Real API Call
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({
            language: language,
            audioFormat: 'mp3',
            audioBase64: cleanBase64
          })
        });

        const data = await response.json();

        if (!response.ok || data.status === 'error') {
          throw new Error(data.message || 'API request failed');
        }

        setResult(data);
      }
      setAppState('SUCCESS');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
      setAppState('ERROR');
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAppState('IDLE');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-700 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                VoiceGuard AI
              </h1>
              <p className="text-slate-400 text-sm">Deepfake Audio Detection System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <ShieldCheck className="w-3 h-3 text-green-400" />
            <span className="text-slate-300">System Secure</span>
          </div>
        </header>

        {/* Configuration Section (Collapsible or always visible) */}
        <APIConfig 
          apiKey={apiKey} 
          setApiKey={setApiKey} 
          apiUrl={apiUrl} 
          setApiUrl={setApiUrl}
          useMock={useMock}
          setUseMock={setUseMock}
        />

        {/* Main Content Area */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Input */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-blue-400" />
                Upload Audio Sample
              </h2>
              
              <AudioUploader file={file} setFile={setFile} />

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!file || appState === 'ANALYZING'}
                className={`w-full mt-8 py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
                  ${!file || appState === 'ANALYZING'
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/50'
                  }`}
              >
                {appState === 'ANALYZING' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Features...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Detect Voice
                  </span>
                )}
              </button>
            </div>

            {/* Supported Languages Info */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 text-sm text-slate-400 flex items-start gap-3">
              <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <p>
                Supported languages: Tamil, English, Hindi, Malayalam, Telugu. 
                Please ensure the file is in MP3 format.
              </p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="relative">
            {appState === 'ERROR' && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="font-bold text-red-100 mb-1">Analysis Failed</h3>
                  <p className="text-sm opacity-90">{error}</p>
                  <button onClick={resetAnalysis} className="mt-4 text-xs font-semibold underline hover:text-white">
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {appState === 'SUCCESS' && result && (
              <ResultCard result={result} onReset={resetAnalysis} />
            )}

            {appState === 'IDLE' && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-12 text-slate-500 bg-slate-800/20">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Ready to Analyze</p>
                  <p className="text-sm opacity-60">Upload an audio file to begin</p>
                </div>
              </div>
            )}
             
            {appState === 'ANALYZING' && (
               <div className="h-full flex flex-col items-center justify-center rounded-2xl p-12 bg-slate-800/20 border border-slate-700/50 relative overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                 <Activity className="w-16 h-16 mx-auto mb-6 text-blue-500 animate-bounce" />
                 <p className="text-xl font-bold text-slate-200">Processing Audio</p>
                 <p className="text-sm text-slate-400 mt-2">Extracting MFCC features...</p>
                 <p className="text-sm text-slate-400">Analyzing Pitch variation...</p>
               </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}