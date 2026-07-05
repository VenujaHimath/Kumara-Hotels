"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, Globe, ChevronDown, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowLangMenu(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/hotels', label: t('navHotels') },
    { href: '/booking', label: t('navBooking') },
  ];

  const languages = [
    { code: 'en', label: t('langEn') },
    { code: 'si', label: t('langSi') },
    { code: 'ta', label: t('langTa') },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-luxury-obsidian/90 backdrop-blur-md border-b border-luxury-obsidian-border py-4 shadow-xl' 
        : 'bg-transparent py-6 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Award className="h-7 w-7 text-luxury-gold transition-transform duration-700 group-hover:rotate-[360deg]" />
          <span className="font-serif text-xl md:text-2xl font-bold tracking-widest text-white group-hover:text-luxury-gold transition-colors duration-300">
            KUMARA
          </span>
          <span className="text-[10px] font-sans text-luxury-gold tracking-widest align-super font-semibold">HOTELS</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-widest font-sans transition-all duration-300 relative py-1 ${
                pathname === link.href
                  ? 'text-luxury-gold font-medium'
                  : 'text-luxury-silver-muted hover:text-white'
              }`}
            >
              {pathname === link.href && (
                <motion.span 
                  layoutId="activeNav" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" 
                />
              )}
              {link.label}
            </Link>
          ))}

          {/* Sign In Button */}
          <Link
            href="/login"
            className="px-4 py-1.5 rounded border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-black text-xs tracking-widest font-sans uppercase font-bold transition-all duration-300"
          >
            Sign In
          </Link>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 text-sm text-luxury-silver-muted hover:text-white transition-colors duration-300 py-1"
            >
              <Globe className="h-4 w-4 text-luxury-gold/80" />
              <span className="uppercase tracking-widest font-sans">{language}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-36 bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-md shadow-2xl overflow-hidden py-1"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs tracking-wider font-sans hover:bg-white/5 transition-colors duration-200 ${
                        language === lang.code ? 'text-luxury-gold font-semibold' : 'text-luxury-silver-muted'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center space-x-4">
          {/* Quick Language Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 text-xs text-luxury-silver-muted py-1"
            >
              <Globe className="h-3.5 w-3.5 text-luxury-gold" />
              <span className="uppercase tracking-widest">{language}</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-luxury-obsidian-card border border-luxury-obsidian-border rounded shadow-xl py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs ${
                      language === lang.code ? 'text-luxury-gold font-bold' : 'text-luxury-silver-muted'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-luxury-silver hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-luxury-obsidian/95 border-b border-luxury-obsidian-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-widest font-sans py-2 border-b border-white/5 ${
                    pathname === link.href 
                      ? 'text-luxury-gold font-medium' 
                      : 'text-luxury-silver-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/login"
                className="text-center py-2 text-sm tracking-widest font-sans font-bold text-luxury-gold border border-luxury-gold/30 rounded mt-4 hover:bg-luxury-gold hover:text-black transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

