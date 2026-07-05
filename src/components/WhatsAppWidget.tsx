'use client';

/**
 * @file src/components/WhatsAppWidget.tsx
 *
 * Floating WhatsApp chat button — visible on every page via layout.tsx.
 *
 * All WhatsApp logic is delegated to useWhatsApp (which reads language from
 * context and builds the URL via src/lib/whatsapp.ts).
 * This component owns zero knowledge of phone numbers or message text.
 */

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import WhatsAppConfirmModal from '@/components/WhatsAppConfirmModal';

export default function WhatsAppWidget() {
  const { t } = useLanguage();
  const { openWhatsApp, confirmProps } = useWhatsApp();

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="WhatsApp Concierge"
      >
        {/* Live notification pulse */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>

        <MessageCircle className="h-6 w-6 fill-current text-white" />

        {/* Hover tooltip */}
        <span className="absolute right-14 bg-luxury-obsidian border border-luxury-obsidian-border text-white text-xs py-1.5 px-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap tracking-wider font-sans">
          {t('whatsappBtn')}
        </span>
      </button>

      {/* Confirmation modal — rendered here so it sits above the button in the stacking context */}
      <WhatsAppConfirmModal {...confirmProps} />
    </>
  );
}
