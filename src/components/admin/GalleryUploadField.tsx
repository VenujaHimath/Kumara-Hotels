'use client';

import React, { useRef, useState } from 'react';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';

export interface GalleryItem {
  url: string;
  title: string;
  category: 'Rooms' | 'Apartment' | 'Ambience' | 'Exterior';
}

interface GalleryUploadFieldProps {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  folder?: string;
}

const CATEGORIES: GalleryItem['category'][] = ['Rooms', 'Apartment', 'Ambience', 'Exterior'];

export default function GalleryUploadField({ items, onChange, folder = 'gallery' }: GalleryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();

    if (res.ok && json.success) return json.url;
    throw new Error(json.error || 'Upload failed');
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    setError('');
    const newItems: GalleryItem[] = [];

    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        if (url) {
          newItems.push({
            url,
            title: `Photo ${items.length + newItems.length + 1}`,
            category: 'Rooms',
          });
        }
      }
      onChange([...items, ...newItems]);
    } catch (e: any) {
      setError(e.message || 'One or more uploads failed.');
      if (newItems.length > 0) onChange([...items, ...newItems]);
    } finally {
      setUploading(false);
    }
  };

  const updateItem = (index: number, patch: Partial<GalleryItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold flex items-center space-x-1">
        <ImageIcon className="h-3.5 w-3.5" />
        <span>Photo Gallery</span>
      </label>

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div key={`${item.url}-${index}`} className="relative group border border-white/10 rounded-lg overflow-hidden bg-luxury-obsidian">
              <div className="relative aspect-[4/3]">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="p-2 space-y-1.5">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  placeholder="Photo title"
                  className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-luxury-gold"
                />
                <select
                  value={item.category}
                  onChange={(e) => updateItem(index, { category: e.target.value as GalleryItem['category'] })}
                  className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-luxury-gold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-white/5 hover:bg-luxury-gold/20 border border-dashed border-white/20 hover:border-luxury-gold rounded-lg text-xs text-white transition-all duration-200 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-luxury-gold" />
            <span>Uploading photos...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 text-luxury-gold" />
            <span>Upload Gallery Photos</span>
            <span className="text-luxury-silver-muted">(select one or more)</span>
          </>
        )}
      </button>

      {error && <p className="text-[10px] text-red-400">{error}</p>}
      <p className="text-[10px] text-luxury-silver-muted">
        {items.length === 0
          ? 'No gallery photos yet. Click the button above to upload images.'
          : `${items.length} photo${items.length !== 1 ? 's' : ''} in gallery. Save hotel profile to publish.`}
      </p>
    </div>
  );
}
