'use client';

/**
 * @file src/components/WhatsAppConfirmModal.tsx
 *
 * Pure presentational confirmation dialog shown before redirecting to WhatsApp.
 *
 * DESIGN PRINCIPLES
 * ─────────────────
 * • Stateless: all data and callbacks come from the parent via props.
 * • Self-contained styles — no extra dependencies beyond Tailwind + lucide.
 * • Accessible: focus-trap via autoFocus on the Cancel button, role="dialog",
 *   aria-modal, and Escape key dismissal.
 * • Zero layout shift: uses a portal-like fixed overlay, does not affect
 *   the document flow beneath it.
 *
 * PROPS (all injected by useWhatsApp.confirmProps)
 * ────────────────────────────────────────────────
 *  isOpen   — whether to render the modal
 *  phone    — human-readable phone string (e.g. "+94 72 719 1184")
 *  message  — pre-filled message text for preview
 *  onCancel — called when user dismisses without proceeding
 *  onConfirm — called when user confirms; hook opens WhatsApp then closes modal
 */

import React, { useEffect, useRef } from 'react';
import { MessageCircle, Phone, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface WhatsAppConfirmModalProps {
  isOpen: boolean;
  phone: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function WhatsAppConfirmModal({
  isOpen,
  phone,
  message,
  onCancel,
  onConfirm,
}: WhatsAppConfirmModalProps) {
  const { t } = useLanguage();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  // Auto-focus Cancel button when modal opens (safe default)
  useEffect(() => {
    if (isOpen) {
      // Small timeout to let framer/CSS transitions settle before stealing focus
      const id = setTimeout(() => cancelRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
      onClick={(e) => {
        // Dismiss when clicking the backdrop itself
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* Panel */}
      <div className="relative w-full max-w-sm bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl shadow-2xl overflow-hidden">

        {/* Close icon */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1.5 rounded hover:bg-white/5 text-luxury-silver-muted hover:text-white transition-colors duration-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 px-6 pt-6 pb-4 border-b border-white/5">
          <div className="p-2.5 bg-[#25D366]/10 rounded-full border border-[#25D366]/20">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
          </div>
          <div>
            <h2
              id="wa-modal-title"
              className="text-sm font-serif text-white font-semibold"
            >
              {t('whatsappModalTitle')}
            </h2>
            <p className="text-[10px] text-luxury-silver-muted font-sans mt-0.5">
              {t('whatsappModalSub')}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Phone row */}
          <div className="flex items-start space-x-3">
            <Phone className="h-4 w-4 text-luxury-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-sans tracking-widest uppercase text-luxury-silver-muted font-semibold">
                {t('whatsappModalPhone')}
              </p>
              <p className="text-sm font-sans text-white mt-0.5">{phone}</p>
            </div>
          </div>

          {/* Message preview */}
          <div className="space-y-1.5">
            <p className="text-[9px] font-sans tracking-widest uppercase text-luxury-silver-muted font-semibold">
              {t('whatsappModalMessage')}
            </p>
            <div className="bg-black/30 border border-white/5 rounded-lg px-4 py-3">
              <p className="text-xs text-luxury-silver leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 py-2.5 bg-transparent border border-white/10 hover:border-white/25 text-luxury-silver-muted hover:text-white rounded text-xs font-sans tracking-widest uppercase transition-all duration-200"
          >
            {t('whatsappModalCancel')}
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded text-xs font-sans font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-lg shadow-[#25D366]/15"
          >
            <span>{t('whatsappModalContinue')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
