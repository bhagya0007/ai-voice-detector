import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';

interface APIConfigProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  useMock: boolean;
  setUseMock: (mock: boolean) => void;
}

export const APIConfig: React.FC<APIConfigProps> = ({ apiKey, setApiKey, apiUrl, setApiUrl, useMock, setUseMock }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Connection Settings</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-slate-700 space-y-4 bg-slate-900/30">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-slate-300">Mode</label>
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setUseMock(true)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${useMock ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Mock / Demo
              </button>
              <button
                onClick={() => setUseMock(false)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${!useMock ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Live API
              </button>
            </div>
          </div>

          <div className={`space-y-4 transition-opacity ${useMock ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">API Endpoint</label>
              <input 
                type="text" 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">API Key (x-api-key)</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};