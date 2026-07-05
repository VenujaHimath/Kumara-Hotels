"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Award } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-luxury-obsidian-deep border-t border-luxury-obsidian-border text-luxury-silver-muted pt-10 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-luxury-gold" />
            <span className="font-serif text-lg font-bold tracking-widest text-white">KUMARA</span>
            <span className="text-[9px] font-sans text-luxury-gold tracking-widest font-semibold">HOTELS</span>
          </div>
          <p className="text-xs leading-relaxed text-luxury-silver-muted/80">
            A prestigious collection of four distinct sanctuaries across Sri Lanka, curated to offer unmatched luxury, local authenticity, and modern comforts.
          </p>
          <div className="flex space-x-2 pt-2">
            <a href="#" className="hover:text-luxury-gold transition-colors duration-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-luxury-gold transition-colors duration-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-luxury-gold transition-colors duration-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
          </div>
        </div>

        {/* Hotels Collection */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold">{t('navHotels')}</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/hotels/sanhida" className="hover:text-luxury-gold transition-colors duration-300">
                Sanhida Guest House — Nugegoda
              </Link>
            </li>
            <li>
              <Link href="/hotels/lake-garden" className="hover:text-luxury-gold transition-colors duration-300">
                Lake Garden Villa — Battaramulla
              </Link>
            </li>
            <li>
              <Link href="/hotels/city-heaven" className="hover:text-luxury-gold transition-colors duration-300">
                City Heaven Villa — Colombo
              </Link>
            </li>
            <li>
              <Link href="/hotels/the-option" className="hover:text-luxury-gold transition-colors duration-300">
                Option Resort & Restaurant — Mount Lavinia
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Quick Actions</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-luxury-gold transition-colors duration-300">{t('navHome')}</Link></li>
            <li><Link href="/booking" className="hover:text-luxury-gold transition-colors duration-300">{t('navBooking')}</Link></li>
            <li><Link href="/admin" className="hover:text-luxury-gold transition-colors duration-300">{t('navAdmin')}</Link></li>
            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">Media Kit & Press</a></li>
            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Concierge Desk</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-luxury-gold/80 flex-shrink-0" />
              <span>Galle Road, Colombo 03, Sri Lanka</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-luxury-gold/80 flex-shrink-0" />
              <a
                href={`tel:${(process.env.NEXT_PUBLIC_CONTACT_PHONE || '+94112345678').replace(/\s/g, '')}`}
                className="hover:text-luxury-gold transition-colors duration-300"
              >
                {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+94 11 234 5678'}
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-luxury-gold/80 flex-shrink-0" />
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'concierge@kumarahotels.com'}`}
                className="hover:text-luxury-gold transition-colors duration-300 break-all"
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'concierge@kumarahotels.com'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-luxury-obsidian-border text-center space-y-2">
        <p className="text-xs text-luxury-silver-muted/60">
          {t('footerText')}
        </p>
        <p className="text-[10px] tracking-widest text-luxury-gold/50 font-sans uppercase">
          {t('footerSub')}
        </p>
      </div>
    </footer>
  );
}
