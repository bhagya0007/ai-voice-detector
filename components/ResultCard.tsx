import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle, AlertOctagon, Fingerprint } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const isAI = result.classification === 'AI_GENERATED';
  // We still use percentage for the visual bar width logic, but strictly display decimal text
  const confidencePercent = result.confidenceScore * 100;

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header Banner */}
      <div className={`p-6 ${isAI ? 'bg-red-500/10 border-b border-red-500/20' : 'bg-green-500/10 border-b border-green-500/20'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">Analysis Result</span>
          <span className="text-xs bg-slate-900/50 px-2 py-1 rounded text-slate-300">{result.language}</span>
        </div>
        <div className="flex items-center gap-3">
          {isAI ? (
            <AlertOctagon className="w-8 h-8 text-red-500" />
          ) : (
            <CheckCircle className="w-8 h-8 text-green-500" />
          )}
          <h2 className={`text-2xl font-bold ${isAI ? 'text-red-400' : 'text-green-400'}`}>
            {isAI ? 'AI Generated Voice' : 'Human Voice'}
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Confidence Score (0.0 - 1.0)</span>
            <span className="font-mono text-xl text-slate-200 font-bold">
              {result.confidenceScore.toFixed(4)}
            </span>
          </div>
          <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-1000 ease-out ${isAI ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-blue-400" />
            Detailed Analysis
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {result.explanation}
          </p>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl border border-slate-600 hover:bg-slate-700/50 text-slate-300 transition-colors"
        >
          Analyze Another File
        </button>
      </div>
    </div>
  );
};