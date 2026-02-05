import React, { useRef } from 'react';
import { Upload, X, FileMusic } from 'lucide-react';

interface AudioUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ file, setFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'audio/mpeg') {
      setFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="audio/mpeg"
        className="hidden"
      />
      
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-slate-800/50 group-hover:shadow-lg"
        >
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-slate-200 font-medium">Click to upload or drag & drop</p>
          <p className="text-slate-500 text-sm mt-1">MP3 Audio Files Only</p>
        </div>
      ) : (
        <div className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between border border-slate-600">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
              <FileMusic className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};