/**
 * @file src/lib/whatsapp.ts
 *
 * Single source of truth for all WhatsApp click-to-chat logic.
 *
 * ARCHITECTURE DECISION
 * ─────────────────────
 * All WhatsApp data (phone, messages) and URL construction live here.
 * No other file may hard-code a phone number or build a wa.me URL —
 * they must import from this module. This guarantees:
 *   • one place to update the phone number or message copy
 *   • consistent URL encoding across every entry-point
 *   • easy testability (pure functions, no side-effects)
 *
 * USAGE
 * ─────
 *   import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/whatsapp';
 *   const url = buildWhatsAppUrl('en');          // general inquiry
 *   const url = buildWhatsAppUrl('si', hotel);   // hotel-specific inquiry
 */

// ─── Phone number ─────────────────────────────────────────────────────────────
// International format, no leading +, no spaces, no dashes.
// Read from env at runtime so the value can be changed per environment without
// rebuilding the app. The fallback is the real production number.

export const WHATSAPP_PHONE: string =
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '') ||
  '94727191184';

// Human-readable display form used in UI (e.g. modal phone preview)
export const WHATSAPP_PHONE_DISPLAY = '+94 72 719 1184';

// ─── Message templates ────────────────────────────────────────────────────────
// Keyed by language code ('en' | 'si' | 'ta') and inquiry context
// ('general' | 'hotel').  Keep them short — WhatsApp URL-encodes the text and
// extremely long messages can cause issues on some mobile browsers.

export type SupportedLanguage = 'en' | 'si' | 'ta';

export interface WhatsAppMessages {
  /** Sent from the floating widget / generic entry-points */
  general: string;
  /** Sent from a specific hotel page; receives {hotelName} at runtime */
  hotel: string;
}

export const WHATSAPP_MESSAGES: Record<SupportedLanguage, WhatsAppMessages> = {
  en: {
    general:
      "Hello! I'm interested in booking a room at Kumara Hotels. Could you please provide availability and pricing?",
    hotel:
      "Hello! I'm viewing the {hotelName} page and would like to inquire about room availability and pricing.",
  },
  si: {
    general:
      'ආයුබෝවන්, මට කුමාර හොටෙල්ස් හි කාමරයක් වෙන්කරවා ගැනීමට තොරතුරු අවශ්‍යයි.',
    hotel:
      'ආයුබෝවන්, මම {hotelName} පිටුව බලා සිටිනෙමි. කාමර ලබා ගැනීමේ හැකියාව සහ මිල ගැන දැන ගැනීමට කැමැත්තෙමි.',
  },
  ta: {
    general:
      'வணக்கம், குமாரா ஹோட்டல்களில் தங்குவதற்கு அறை பதிவு செய்ய விரும்புகிறேன்.',
    hotel:
      'வணக்கம், நான் {hotelName} பக்கத்தை பார்க்கிறேன். அறை கிடைக்கும் தன்மை மற்றும் விலை பற்றி தெரிந்துகொள்ள விரும்புகிறேன்.',
  },
};

// ─── URL builder ──────────────────────────────────────────────────────────────

export interface WhatsAppUrlOptions {
  /** Active UI language — determines which message template is used */
  language?: SupportedLanguage;
  /** When provided, uses the hotel-specific message template */
  hotelName?: string;
}

/**
 * Build a fully-encoded wa.me URL.
 *
 * @example
 * buildWhatsAppUrl()                              // general, English
 * buildWhatsAppUrl({ language: 'si' })            // general, Sinhala
 * buildWhatsAppUrl({ language: 'en', hotelName: 'Lake Garden Villa' })
 */
export function buildWhatsAppUrl(options: WhatsAppUrlOptions = {}): string {
  const { language = 'en', hotelName } = options;

  const templates = WHATSAPP_MESSAGES[language] ?? WHATSAPP_MESSAGES.en;

  let message: string;
  if (hotelName) {
    message = templates.hotel.replace('{hotelName}', hotelName);
  } else {
    message = templates.general;
  }

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Resolve the pre-filled message text for display in the confirmation modal.
 * Mirrors the template selection logic inside buildWhatsAppUrl.
 */
export function resolveWhatsAppMessage(options: WhatsAppUrlOptions = {}): string {
  const { language = 'en', hotelName } = options;
  const templates = WHATSAPP_MESSAGES[language] ?? WHATSAPP_MESSAGES.en;
  return hotelName
    ? templates.hotel.replace('{hotelName}', hotelName)
    : templates.general;
}
