'use client';

/**
 * @file src/hooks/useWhatsApp.ts
 *
 * Centralised hook for the WhatsApp click-to-chat feature.
 *
 * RESPONSIBILITIES
 * ─────────────────
 * • Exposes a single `openWhatsApp(options?)` function that every component
 *   in the app calls — no component builds a URL themselves.
 * • Manages the confirmation-modal state so the modal itself stays a pure,
 *   stateless presentational component.
 * • Reads the current UI language from LanguageContext automatically so
 *   callers do not have to pass it explicitly.
 *
 * USAGE
 * ─────
 *   const { openWhatsApp, confirmProps } = useWhatsApp();
 *
 *   // Open general inquiry
 *   <button onClick={() => openWhatsApp()}>Chat</button>
 *
 *   // Open hotel-specific inquiry
 *   <button onClick={() => openWhatsApp({ hotelName: hotel.name })}>Inquire</button>
 *
 *   // Mount the modal (once, in the same component tree)
 *   <WhatsAppConfirmModal {...confirmProps} />
 */

import { useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  buildWhatsAppUrl,
  resolveWhatsAppMessage,
  WHATSAPP_PHONE_DISPLAY,
  type WhatsAppUrlOptions,
} from '@/lib/whatsapp';

export interface WhatsAppConfirmState {
  isOpen: boolean;
  phone: string;
  message: string;
  url: string;
}

export interface UseWhatsAppReturn {
  /** Call this to trigger the confirmation dialog for any entry-point */
  openWhatsApp: (options?: Partial<Pick<WhatsAppUrlOptions, 'hotelName'>>) => void;
  /** Spread onto <WhatsAppConfirmModal /> */
  confirmProps: WhatsAppConfirmState & {
    onCancel: () => void;
    onConfirm: () => void;
  };
}

export function useWhatsApp(): UseWhatsAppReturn {
  const { language } = useLanguage();

  const [state, setState] = useState<WhatsAppConfirmState>({
    isOpen: false,
    phone: WHATSAPP_PHONE_DISPLAY,
    message: '',
    url: '',
  });

  const openWhatsApp = useCallback(
    (options: Partial<Pick<WhatsAppUrlOptions, 'hotelName'>> = {}) => {
      const opts: WhatsAppUrlOptions = { language, ...options };
      setState({
        isOpen: true,
        phone: WHATSAPP_PHONE_DISPLAY,
        message: resolveWhatsAppMessage(opts),
        url: buildWhatsAppUrl(opts),
      });
    },
    [language],
  );

  const onCancel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const onConfirm = useCallback(() => {
    // Close modal first, then navigate — avoids the modal staying visible
    // during the browser redirect / app-switch to WhatsApp.
    setState((prev) => ({ ...prev, isOpen: false }));
    window.open(state.url, '_blank', 'noopener,noreferrer');
  }, [state.url]);

  return {
    openWhatsApp,
    confirmProps: { ...state, onCancel, onConfirm },
  };
}
