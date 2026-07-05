"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { reviews, galleryImages } from '@/data/hotelsData';
import { useLiveHotels } from '@/hooks/useLiveHotels';
import HotelImage from '@/components/HotelImage';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Star, ChevronLeft, ChevronRight, Award, Compass, Heart, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const { t, translateFacility } = useLanguage();
  const { hotels, loading: hotelsLoading } = useLiveHotels();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Gallery filter
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('All');
  const categories = ['All', 'Rooms', 'Exterior', 'Food', 'Events', 'Experiences'];

  const filteredGallery = selectedGalleryCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedGalleryCategory);

  const nextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Facilities data list for the Facilities Section
  const facilitiesGrid = [
    { title: "Luxury Rooms", desc: "Plush bedding, state-of-the-art climate control, and breathtaking panoramas.", icon: "🛏️" },
    { title: "Fine Dining", desc: "Award-winning international chefs curating sensory culinary masterpieces.", icon: "🍽️" },
    { title: "Bespoke Events", desc: "Elegant corporate conferences, grand galas, and romantic sunset weddings.", icon: "🎉" },
    { title: "Secure Parking", desc: "24/7 monitored valet and secure parking options for absolute peace of mind.", icon: "🚗" },
    { title: "Ultra High-Speed WiFi", desc: "Seamless high-bandwidth internet connectivity throughout all resorts.", icon: "📶" },
    { title: "Attraction Concierge", desc: "Guided local safaris, private historic excursions, and custom trails.", icon: "🗺️" }
  ];

  return (
    <div className="relative min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=85"
            alt="Luxury Hotel Main Background"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-[0.35] transition-all duration-[10s]"
          />
          {/* Subtle gold gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 backdrop-blur-md"
          >
            <Award className="h-4 w-4 text-luxury-gold" />
            <span className="text-[10px] md:text-xs font-sans tracking-widest text-luxury-gold uppercase font-semibold">
              The Epitome of Hospitality
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-7xl font-serif leading-tight font-extrabold text-white"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base md:text-xl font-light text-luxury-silver-muted max-w-2xl mx-auto leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/hotels"
              className="w-full sm:w-auto px-8 py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 shadow-lg shadow-luxury-gold/25 hover:shadow-luxury-gold/40 animate-shine"
            >
              {t('btnExplore')}
            </Link>
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 border border-white/30 text-white rounded font-sans tracking-widest text-xs uppercase transition-all duration-300"
            >
              {t('btnCheckAvailability')}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 z-10 opacity-70">
          <span className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-luxury-gold to-transparent" />
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STATS */}
      <section className="bg-luxury-obsidian-deep py-12 md:py-16 border-b border-luxury-obsidian-border relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {[
            { number: "4", label: "Award-Winning Hotels" },
            { number: "12", label: "Luxury Room Types" },
            { number: "99.8%", label: "Satisfaction Rate" },
            { number: "24/7", label: "Bespoke Concierge" }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-luxury-gold">{stat.number}</h3>
              <p className="text-[10px] md:text-xs font-sans tracking-widest text-luxury-silver-muted uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HOTELS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 space-y-4">
          <div className="h-[1px] w-20 bg-luxury-gold mx-auto" />
          <h2 className="text-3xl md:text-5xl font-serif">{t('sectionFeatured')}</h2>
          <p className="text-sm font-sans text-luxury-silver-muted max-w-lg mx-auto leading-relaxed">
            {t('sectionFeaturedSub')}
          </p>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="glass-panel rounded-xl overflow-hidden glass-panel-hover flex flex-col group"
            >
              <div className="relative h-64 md:h-80 overflow-hidden">
                <HotelImage
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                
                {/* Location Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/15 text-xs text-white">
                  <MapPin className="h-3.5 w-3.5 text-luxury-gold" />
                  <span>{hotel.location}</span>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif text-white group-hover:text-luxury-gold transition-colors duration-300">
                    {hotel.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-luxury-silver-muted">
                    {hotel.description}
                  </p>
                </div>

                {/* Facilities List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-sans tracking-widest text-luxury-gold uppercase font-semibold">
                    {t('facilities')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.facilities.map((fac) => (
                      <span
                        key={fac}
                        className="text-[10px] font-sans bg-white/5 border border-white/10 text-luxury-silver px-2.5 py-1 rounded"
                      >
                        {translateFacility(fac)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Button */}
                <div className="pt-2 border-t border-white/5">
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    className="inline-flex items-center space-x-2 text-xs tracking-widest font-sans uppercase text-luxury-gold hover:text-white transition-colors duration-300"
                  >
                    <span>{t('viewHotel')}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. EXCLUSIVE FACILITIES HIGHLIGHT PANEL */}
      <section className="bg-luxury-obsidian-card border-y border-luxury-obsidian-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-4">
            <div className="h-[1px] w-20 bg-luxury-gold mx-auto" />
            <h2 className="text-3xl md:text-5xl font-serif">{t('sectionFacilities')}</h2>
            <p className="text-sm font-sans text-luxury-silver-muted max-w-lg mx-auto leading-relaxed">
              {t('sectionFacilitiesSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilitiesGrid.map((fac, i) => (
              <div
                key={i}
                className="bg-luxury-obsidian/50 border border-white/5 p-8 rounded-lg hover:border-luxury-gold/25 transition-all duration-300 space-y-4 group"
              >
                <div className="text-3xl p-3 bg-white/5 rounded-md w-fit group-hover:bg-luxury-gold/10 transition-colors duration-300">
                  {fac.icon}
                </div>
                <h4 className="text-lg font-serif text-white">{fac.title}</h4>
                <p className="text-xs leading-relaxed text-luxury-silver-muted">{fac.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VISUAL GALLERY (FILTERABLE) */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12 space-y-4">
          <div className="h-[1px] w-20 bg-luxury-gold mx-auto" />
          <h2 className="text-3xl md:text-5xl font-serif">{t('sectionGallery')}</h2>
          <p className="text-sm font-sans text-luxury-silver-muted max-w-lg mx-auto leading-relaxed">
            {t('sectionGallerySub')}
          </p>
        </div>

        {/* Gallery Categories filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedGalleryCategory(cat)}
              className={`px-4 py-2 rounded text-xs tracking-widest font-sans uppercase transition-all duration-300 border ${
                selectedGalleryCategory === cat
                  ? 'bg-luxury-gold border-luxury-gold text-black font-semibold'
                  : 'bg-transparent border-white/10 text-luxury-silver-muted hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredGallery.map((img, i) => (
            <motion.div
              layout
              key={i}
              className="relative h-64 md:h-72 rounded-lg overflow-hidden group border border-white/5 shadow-lg"
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              {/* Blur Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 space-y-1">
                <span className="text-[9px] font-sans tracking-widest text-luxury-gold uppercase font-bold">
                  {img.category}
                </span>
                <h5 className="text-sm font-serif text-white font-medium">
                  {img.title}
                </h5>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. REVIEWS SLIDER */}
      <section className="bg-luxury-obsidian-deep border-t border-luxury-obsidian-border py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-luxury-gold rounded-full filter blur-[150px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-luxury-gold rounded-full filter blur-[150px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
          <div className="h-[1px] w-20 bg-luxury-gold mx-auto" />
          <h2 className="text-3xl md:text-5xl font-serif">{t('sectionReviews')}</h2>

          <div className="min-h-[220px] flex flex-col justify-center">
            {reviews.map((rev, idx) => (
              idx === activeReviewIndex && (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center space-x-1 text-luxury-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl font-light italic leading-relaxed text-white">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-12 h-12 rounded-full border border-luxury-gold/50 object-cover"
                    />
                    <div className="text-left">
                      <h4 className="text-sm font-sans font-bold text-white tracking-wide">{rev.name}</h4>
                      <p className="text-xs text-luxury-silver-muted">{rev.role} • {rev.hotel}</p>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <button
              onClick={prevReview}
              className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10 hover:border-luxury-gold rounded text-luxury-silver hover:text-luxury-gold transition-colors duration-300"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs tracking-widest font-sans font-semibold text-luxury-gold">
              {String(activeReviewIndex + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
            </span>
            <button
              onClick={nextReview}
              className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10 hover:border-luxury-gold rounded text-luxury-silver hover:text-luxury-gold transition-colors duration-300"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. TRUST AND SERVICE HIGHLIGHT */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Safe & Verified Bookings", desc: "Your reservation is direct, secure, and backed by instantaneous digital receipts.", icon: <ShieldCheck className="h-8 w-8 text-luxury-gold" /> },
          { title: "No Hidden Surcharges", desc: "Complete pricing transparency with tax breakdown and zero reservation fees.", icon: <Compass className="h-8 w-8 text-luxury-gold" /> },
          { title: "Personalized Gestures", desc: "Receive complementary champagne, local sweets, and customizable pillow menu.", icon: <Heart className="h-8 w-8 text-luxury-gold" /> }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 glass-panel rounded-lg">
            {item.icon}
            <h3 className="text-base font-sans font-semibold text-white uppercase tracking-wider">{item.title}</h3>
            <p className="text-xs text-luxury-silver-muted leading-relaxed max-w-xs">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
