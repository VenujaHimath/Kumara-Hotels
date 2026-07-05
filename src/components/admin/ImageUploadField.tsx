'use client';

import React, { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  previewClassName?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'general',
  previewClassName = 'w-32 h-24',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();

      if (res.ok && json.success) {
        onChange(json.url);
      } else {
        setError(json.error || 'Upload failed.');
      }
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block">
        {label}
      </label>

      <div className="flex flex-wrap items-start gap-3">
        {value && (
          <div className="relative group">
            <img src={value} alt="Preview" className={`${previewClassName} object-cover rounded border border-white/10`} />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or upload below"
            className="w-full bg-luxury-obsidian border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-white/5 hover:bg-luxury-gold/20 border border-white/10 hover:border-luxury-gold rounded text-xs text-white transition-all duration-200 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
          </button>
          {error && <p className="text-[10px] text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
