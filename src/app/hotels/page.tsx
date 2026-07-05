"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveHotels } from '@/hooks/useLiveHotels';
import { getLowestRoomPrice } from '@/components/RoomPriceDisplay';
import { formatPrice } from '@/lib/formatPrice';
import HotelImage from '@/components/HotelImage';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Award, Loader2 } from 'lucide-react';

export default function HotelsPage() {
  const { t, translateFacility } = useLanguage();
  const { hotels, loading } = useLiveHotels();

  return (
    <div className="relative min-h-screen py-16">
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/3 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mt-8 mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-1.5"
          >
            <Award className="h-5 w-5 text-luxury-gold" />
            <span className="text-[10px] md:text-xs font-sans tracking-widest text-luxury-gold uppercase font-semibold">
              The Collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-6xl font-serif leading-tight font-extrabold text-white"
          >
            Our Sanctuaries
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm md:text-base font-light text-luxury-silver-muted leading-relaxed"
          >
            Explore our curated portfolio of premium accommodations. From peaceful mountain hideouts to pristine sandy beaches, find a destination tailored to your rhythm.
          </motion.p>

          {loading && (
            <div className="flex items-center justify-center space-x-2 text-xs text-luxury-silver-muted pt-2">
              <Loader2 className="h-3 w-3 animate-spin text-luxury-gold" />
              <span>Loading latest photos & prices...</span>
            </div>
          )}
        </div>

        <div className="space-y-24 md:space-y-32">
          {hotels.map((hotel, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                <div className="w-full lg:w-1/2 relative h-80 md:h-[450px] rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
                  <HotelImage
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-[4s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="flex items-center space-x-2 text-luxury-gold">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-sans font-semibold tracking-wider">{hotel.location}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif text-white hover:text-luxury-gold transition-colors duration-300">
                    {hotel.name}
                  </h2>

                  <p className="text-sm leading-relaxed text-luxury-silver-muted font-light">
                    {hotel.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-sans tracking-widest text-luxury-gold uppercase font-bold">
                      {t('facilities')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="text-xs bg-luxury-obsidian-card border border-luxury-obsidian-border text-luxury-silver px-3 py-1.5 rounded"
                        >
                          {translateFacility(fac)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xs font-sans text-luxury-silver-muted">
                      {getLowestRoomPrice(hotel.rooms) > 0 ? (
                        <>
                          Starting from{' '}
                          <span className="text-luxury-gold text-lg font-bold font-serif">
                            {formatPrice(getLowestRoomPrice(hotel.rooms))}
                          </span>
                        </>
                      ) : (
                        <span className="text-luxury-silver-muted">Rates available on request</span>
                      )}
                    </div>

                    <Link
                      href={`/hotels/${hotel.slug}`}
                      className="px-6 py-3 bg-white/5 hover:bg-luxury-gold border border-white/10 hover:border-luxury-gold hover:text-black rounded text-xs tracking-widest font-sans uppercase font-bold transition-all duration-300 inline-flex items-center space-x-2 group-hover:translate-x-1"
                    >
                      <span>Explore Suite</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
