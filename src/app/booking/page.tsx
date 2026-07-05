"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { hotels } from '@/data/hotelsData';
import { RoomPriceDisplay } from '@/components/RoomPriceDisplay';
import { formatPrice } from '@/lib/formatPrice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

// ── Validation helpers ────────────────────────────────────────────────────────

/** Strips all non-digit characters, then checks the result is exactly 10 digits. */
function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  return digits.length === 10;
}

/** Full RFC-5322-like email check — requires a real domain with a dot (e.g. user@gmail.com). */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Normalise facilities to always be a string array regardless of source format. */
function normalizeFacilities(facilities: string | string[] | undefined | null): string[] {
  if (!facilities) return [];
  if (Array.isArray(facilities)) return facilities.filter(Boolean);
  return facilities.split(',').map(f => f.trim()).filter(Boolean);
}

function BookingPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameters
  const paramHotel = searchParams.get('hotel') || '';
  const paramRoom = searchParams.get('room') || '';

  // Form states
  const [selectedHotelId, setSelectedHotelId] = useState(paramHotel);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  
  // Search result states
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  // Booking details form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [bookingType, setBookingType] = useState<'Night Stay' | 'Day Out' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<any>(null);

  // Confirmation modal — shown before actually submitting
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Inline field errors
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; email?: string; bookingType?: string }>({});

  // Live hotels data from DB
  const [liveHotels, setLiveHotels] = useState<any[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);

  // Fetch live hotel data from database on mount
  useEffect(() => {
    const loadHotels = async () => {
      setHotelsLoading(true);
      try {
        const res = await fetch(`/api/hotels?t=${Date.now()}`, { cache: 'no-store' });
        const json = await res.json();
        if (res.ok && json.success && json.data.length > 0) {
          setLiveHotels(json.data);
        } else {
          // Fallback to static if DB empty
          setLiveHotels(hotels.map(h => ({
            ...h,
            rooms: h.rooms.map(r => ({ ...r, roomName: (r as any).name || (r as any).roomName }))
          })));
        }
      } catch (e) {
        console.error('Hotels fetch failed, using static fallback');
        setLiveHotels(hotels.map(h => ({
          ...h,
          rooms: h.rooms.map(r => ({ ...r, roomName: (r as any).name || (r as any).roomName }))
        })));
      } finally {
        setHotelsLoading(false);
      }
    };
    loadHotels();
  }, []);

  // Auto-fill dates with defaults if empty
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    setCheckIn(formatDate(today));
    setCheckOut(formatDate(tomorrow));
  }, []);

  // Handle auto-preselection if hotel and room are in URL query params
  useEffect(() => {
    if (paramHotel && liveHotels.length > 0) {
      setSelectedHotelId(paramHotel);
      const matchedHotel = liveHotels.find((h: any) => h.id === paramHotel);
      if (matchedHotel && paramRoom) {
        // Fetch availability data so facilities + remainingUnits are correctly populated
        fetch(`/api/availability?hotelId=${paramHotel}&guests=1&checkIn=${checkIn}&checkOut=${bookingType === 'Day Out' ? checkIn : checkOut}&bookingType=${encodeURIComponent(bookingType)}&t=${Date.now()}`, { cache: 'no-store' })
          .then(r => r.json())
          .then(json => {
            if (json.success) {
              setAvailableRooms(json.data);
              const matchedRoom = json.data.find((r: any) => r.id === paramRoom);
              if (matchedRoom) setSelectedRoom(matchedRoom);
            } else {
              // Fallback: use hotel rooms but normalize facilities
              const rooms = matchedHotel.rooms.map((r: any) => ({
                ...r,
                facilities: normalizeFacilities(r.facilities),
                remainingUnits: r.totalUnits ?? 1,
                fullyBooked: r.status === 'Booked',
              }));
              setAvailableRooms(rooms.filter((r: any) => !r.fullyBooked));
              const matchedRoom = rooms.find((r: any) => r.id === paramRoom);
              if (matchedRoom) setSelectedRoom(matchedRoom);
            }
          })
          .catch(() => {
            const rooms = matchedHotel.rooms.map((r: any) => ({
              ...r,
              facilities: normalizeFacilities(r.facilities),
            }));
            setAvailableRooms(rooms.filter((r: any) => r.status === 'Available'));
          });
        setHasSearched(true);
      }
    }
  }, [paramHotel, paramRoom, liveHotels]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) return;

    setIsSearching(true);

    try {
      // Use the availability API which returns all rooms with remaining unit counts
      const res = await fetch(
        `/api/availability?hotelId=${selectedHotelId}&guests=${guests}&checkIn=${checkIn}&checkOut=${bookingType === 'Day Out' ? checkIn : checkOut}&bookingType=${encodeURIComponent(bookingType)}&t=${Date.now()}`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      if (res.ok && json.success) {
        setAvailableRooms(json.data);
      } else {
        setAvailableRooms([]);
      }
    } catch (e) {
      setAvailableRooms([]);
    }

    setIsSearching(false);
    setHasSearched(true);
    setSelectedRoom(null);
  };

  const handleSelectRoom = (room: any) => {
    setSelectedRoom(room);
    setTimeout(() => {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId || !selectedRoom) return;

    const errors: { name?: string; phone?: string; email?: string; bookingType?: string } = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!isValidPhone(customerPhone)) {
      errors.phone = 'Please enter a valid 10-digit phone number (e.g. 0771234567).';
    }
    if (!isValidEmail(customerEmail)) {
      errors.email = 'Please enter a valid email address (e.g. yourname@gmail.com).';
    }
    if (!bookingType) {
      errors.bookingType = 'Please select Night Stay or Day Out.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    if (!selectedHotelId || !selectedRoom) return;

    setShowConfirmModal(false);
    setIsSubmitting(true);

    // Day Out = flat rate (1 day), Night Stay = price × nights
    const unitPrice = bookingType === 'Day Out' && selectedRoom.dayoutPrice
      ? selectedRoom.dayoutPrice
      : selectedRoom.price;
    const totalPrice = bookingType === 'Day Out' ? unitPrice : unitPrice * getDaysCount();

    const bookingPayload = {
      customerName,
      phone: customerPhone,
      email: customerEmail,
      hotelId: selectedHotelId,
      roomId: selectedRoom.id,
      checkIn,
      checkOut: bookingType === 'Day Out' ? checkIn : checkOut, // same day for Day Out
      guests: parseInt(guests),
      bookingType,
      totalPrice,
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();

      if (response.ok) {
        setBookingSuccessData(result.data);
      } else {
        alert(result.error || 'Booking failed. Please try again.');
      }
    } catch (err) {
      alert('Unable to connect to the reservation server. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysCount = () => {
    if (!checkIn || !checkOut) return 1;
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Returns the per-unit price based on selected booking type
  const getUnitPrice = (room: any) => {
    if (bookingType === 'Day Out' && room?.dayoutPrice) return room.dayoutPrice;
    return room?.price ?? 0;
  };

  const selectedHotel = liveHotels.find(h => h.id === selectedHotelId);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12 relative z-10 pb-28 md:pb-12">
      
      {/* 1. BOOKING SUCCESS STEP */}
      <AnimatePresence mode="wait">
        {bookingSuccessData ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto text-center space-y-8 py-16"
          >
            <div className="flex justify-center">
              <div className="bg-emerald-500/10 p-5 rounded-full border border-emerald-500/30 animate-pulse">
                <CheckCircle className="h-16 w-16 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-serif text-white">{t('bookingSuccess')}</h1>
              <p className="text-sm text-luxury-silver-muted">{t('bookingSuccessSub')}</p>
            </div>

            {/* Receipt Card */}
            <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl p-6 text-left space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-luxury-gold font-bold border-b border-white/5 pb-2">
                {t('bookingDetails')}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-luxury-silver-muted block">Reservation ID</span>
                  <span className="text-white font-semibold">{bookingSuccessData.reservationId || bookingSuccessData.id}</span>
                </div>
                <div>
                  <span className="text-luxury-silver-muted block">Guest Name</span>
                  <span className="text-white font-semibold">{bookingSuccessData.customerName}</span>
                </div>
                <div>
                  <span className="text-luxury-silver-muted block">{t('hotelLabel')}</span>
                  <span className="text-white font-semibold">{bookingSuccessData.hotelName || selectedHotel?.name}</span>
                </div>
                <div>
                  <span className="text-luxury-silver-muted block">{t('roomLabel')}</span>
                  <span className="text-white font-semibold">{bookingSuccessData.roomName || selectedRoom?.roomName || selectedRoom?.name}</span>
                </div>
                <div>
                  <span className="text-luxury-silver-muted block">{t('datesLabel')}</span>
                  <span className="text-white font-semibold">
                    {bookingSuccessData.bookingType === 'Day Out'
                      ? `${bookingSuccessData.checkIn?.split('T')[0] || bookingSuccessData.checkIn} · 11:00 AM – 5:00 PM`
                      : `${bookingSuccessData.checkIn?.split('T')[0] || bookingSuccessData.checkIn} to ${bookingSuccessData.checkOut?.split('T')[0] || bookingSuccessData.checkOut}`
                    }
                  </span>
                </div>
                <div>
                  <span className="text-luxury-silver-muted block">Guests Number</span>
                  <span className="text-white font-semibold">{bookingSuccessData.guests} Adults</span>
                </div>
                <div>
                  <span className="text-luxury-silver-muted block">Booking Type</span>
                  <span className={`font-semibold ${bookingSuccessData.bookingType === 'Day Out' ? 'text-amber-400' : 'text-blue-400'}`}>
                    {bookingSuccessData.bookingType === 'Day Out' ? '☀️ Day Out' : '🌙 Night Stay'}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
                <span className="text-luxury-silver-muted uppercase tracking-wider">Total Investment</span>
                <span className="text-lg font-serif text-luxury-gold font-bold">
                  {formatPrice(bookingSuccessData.totalPrice || bookingSuccessData.totalAmount || (selectedRoom!.price * getDaysCount()))}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingSuccessData(null);
                setHasSearched(false);
                setSelectedRoom(null);
                setSelectedHotelId('');
                router.push('/');
              }}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded text-xs tracking-widest font-sans uppercase transition-all duration-300"
            >
              Return to Home
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" className="space-y-12">
            
            {/* Header */}
            <div className="text-center max-w-xl mx-auto space-y-3 mt-6">
              <h1 className="text-4xl md:text-5xl font-serif">Reserve Your Sanctuary</h1>
              <p className="text-xs md:text-sm text-luxury-silver-muted">
                Configure your preferred dates and guest size to explore tailored availability in our luxury collection.
              </p>
            </div>

            {/* Step 1: Availability Search Form */}
            <form onSubmit={handleSearch} className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-end shadow-2xl">
              {/* Hotel */}
              <div className="sm:col-span-2 md:col-span-1">
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {t('selectHotel')}
                </label>
                {hotelsLoading ? (
                  <div className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3.5 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-luxury-gold" />
                    <span className="text-sm text-luxury-silver-muted">Loading...</span>
                  </div>
                ) : (
                  <select
                    value={selectedHotelId}
                    onChange={(e) => setSelectedHotelId(e.target.value)}
                    required
                    className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                  >
                    <option value="">-- Select Destination --</option>
                    {liveHotels.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Booking Type — here so date fields react immediately */}
              <div>
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {t('bookingTypeLabel')}
                </label>
                <select
                  value={bookingType}
                  onChange={(e) => {
                    const val = e.target.value as 'Night Stay' | 'Day Out' | '';
                    setBookingType(val);
                    setFormErrors(p => ({ ...p, bookingType: undefined }));
                    if (val === 'Day Out') setCheckOut(checkIn);
                  }}
                  required
                  className={`w-full bg-luxury-obsidian border rounded px-4 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 ${formErrors.bookingType ? 'border-red-500' : 'border-white/10'}`}
                >
                  <option value="">-- {t('bookingTypeLabel')} --</option>
                  <option value="Night Stay">🌙 {t('nightStay')}</option>
                  <option value="Day Out">☀️ {t('dayOut')}</option>
                </select>
              </div>

              {/* Check-In */}
              <div>
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {bookingType === 'Day Out' ? t('visitDate') : t('checkIn')}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (bookingType === 'Day Out') setCheckOut(e.target.value);
                  }}
                  required
                  className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 [color-scheme:dark]"
                />
                {bookingType === 'Day Out' && (
                  <p className="text-[10px] text-amber-400 mt-1">☀ {t('dayOutTimeSlot')}</p>
                )}
              </div>

              {/* Check-Out — hidden for Day Out */}
              {bookingType !== 'Day Out' && (
                <div>
                  <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                    {t('checkOut')}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 [color-scheme:dark]"
                  />
                </div>
              )}

              {/* Guests */}
              <div>
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {t('guestsCount') || 'Guests'}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Search button — full width on Day Out (checkout col is gone) */}
              <div className={bookingType === 'Day Out' ? 'sm:col-span-2 md:col-span-1' : 'sm:col-span-2 md:col-span-1'}>
                <button
                  type="submit"
                  disabled={isSearching || !bookingType}
                  className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-black rounded font-sans font-bold tracking-widest text-sm uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-luxury-gold/10 min-h-[50px]"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>{t('btnSearchAvailability')}</span>
                  )}
                </button>
              </div>
            </form>

            {/* Step 2: Available Rooms */}
            {hasSearched && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-serif text-white border-b border-white/5 pb-2">
                  {t('availableRooms')} ({availableRooms.filter((r: any) => !r.fullyBooked).length})
                </h2>

                {availableRooms.length === 0 ? (
                  <div className="text-center py-12 bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg space-y-2">
                    <p className="text-sm text-luxury-silver-muted">No accommodations match your capacity requirements.</p>
                    <p className="text-xs text-luxury-gold">Try reducing guest size or exploring other dates.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {availableRooms.map((room: any) => {
                      const isSelected = selectedRoom?.id === room.id;
                      const isFullyBooked = room.fullyBooked === true;
                      return (
                        <div
                          key={room.id}
                          className={`bg-luxury-obsidian-card border rounded-lg overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                            isFullyBooked
                              ? 'border-white/5 opacity-70'
                              : isSelected
                                ? 'border-luxury-gold ring-1 ring-luxury-gold'
                                : 'border-white/5'
                          }`}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={room.image}
                              alt={room.roomName || room.name}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Fully Booked overlay badge */}
                            {isFullyBooked && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="px-4 py-2 bg-red-500/90 text-white text-xs font-bold uppercase tracking-widest rounded">
                                  Fully Booked
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-lg font-serif text-white">{room.roomName || room.name}</h3>
                                {isFullyBooked && (
                                  <span className="shrink-0 text-[9px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                    Fully Booked
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {normalizeFacilities(room.facilities).map((fac: string) => (
                                  <span key={fac} className="text-[9px] bg-white/5 text-luxury-silver px-2 py-0.5 rounded">
                                    {fac.trim()}
                                  </span>
                                ))}
                              </div>
                              {/* Availability label */}
                              {!isFullyBooked && room.remainingUnits != null && (
                                room.remainingUnits === 1 ? (
                                  <p className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                                    Only 1 room left!
                                  </p>
                                ) : room.remainingUnits <= 3 ? (
                                  <p className="text-[10px] text-amber-400">
                                    Only {room.remainingUnits} rooms left
                                  </p>
                                ) : room.totalUnits > 1 ? (
                                  <p className="text-[10px] text-emerald-400">
                                    {room.remainingUnits} rooms available
                                  </p>
                                ) : null
                              )}
                            </div>

                            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                              <div>
                                <span className="text-xs text-luxury-silver-muted">From</span>
                                <p className="text-lg font-serif text-luxury-gold font-bold">
                                  Rs. {room.price?.toLocaleString()}
                                  <span className="text-[10px] text-luxury-silver-muted font-sans font-normal">/night</span>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => !isFullyBooked && handleSelectRoom(room)}
                                disabled={isFullyBooked}
                                className={`w-full sm:w-auto px-4 py-3 text-sm font-sans tracking-widest uppercase font-bold rounded transition-all duration-300 min-h-[44px] ${
                                  isFullyBooked
                                    ? 'bg-white/5 text-luxury-silver-muted cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-white/5 hover:bg-luxury-gold hover:text-black text-white'
                                }`}
                              >
                                {isFullyBooked ? 'Unavailable' : isSelected ? 'Selected ✓' : 'Select Room'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Customer Details Checkout Form */}
            {selectedRoom && (
              <motion.div
                id="checkout-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl p-6 md:p-8 space-y-6 shadow-2xl"
              >
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-xl font-serif text-white">{t('customerDetails')}</h2>
                  <p className="text-xs text-luxury-silver-muted mt-1">
                    Complete the secure booking process for <span className="text-luxury-gold font-bold">{selectedRoom.roomName || selectedRoom.name}</span> at <span className="text-luxury-gold font-bold">{selectedHotel?.name}</span>.
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block">
                      {t('fullName')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => { setCustomerName(e.target.value); setFormErrors(p => ({ ...p, name: undefined })); }}
                        required
                        placeholder="e.g. John Doe"
                        className={`w-full bg-luxury-obsidian border rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 ${formErrors.name ? 'border-red-500' : 'border-white/10'}`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
                        <AlertTriangle className="h-3 w-3 shrink-0" />{formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block">
                        {t('email')}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => { setCustomerEmail(e.target.value); setFormErrors(p => ({ ...p, email: undefined })); }}
                          required
                          placeholder="e.g. yourname@gmail.com"
                          className={`w-full bg-luxury-obsidian border rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 ${formErrors.email ? 'border-red-500' : 'border-white/10'}`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
                          <AlertTriangle className="h-3 w-3 shrink-0" />{formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block">
                        {t('phone')}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => { setCustomerPhone(e.target.value); setFormErrors(p => ({ ...p, phone: undefined })); }}
                          required
                          maxLength={10}
                          placeholder="e.g. 0771234567"
                          className={`w-full bg-luxury-obsidian border rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200 ${formErrors.phone ? 'border-red-500' : 'border-white/10'}`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
                          <AlertTriangle className="h-3 w-3 shrink-0" />{formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Booking Type — already selected in search form, shown as read-only reminder */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block">
                      {t('bookingTypeLabel')}
                    </label>
                    <div className={`w-full border rounded px-4 py-3 text-xs font-semibold flex items-center gap-2 ${
                      bookingType === 'Day Out'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    }`}>
                      {bookingType === 'Day Out' ? `☀️ ${t('dayOut')} — ${t('dayOutTimeSlot')}` : `🌙 ${t('nightStay')}`}
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded border border-white/5 space-y-2 text-xs">
                    {bookingType === 'Day Out' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-luxury-silver-muted">{t('dayOut')} Rate</span>
                          <span className="text-white font-medium">{formatPrice(getUnitPrice(selectedRoom))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-silver-muted">{t('timeSlot')}</span>
                          <span className="text-amber-400 font-medium">{t('dayOutTimeSlot')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-silver-muted">{t('visitDate')}</span>
                          <span className="text-white font-medium">{checkIn}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 font-bold">
                          <span className="text-luxury-gold uppercase tracking-wider">{t('totalLabel')}</span>
                          <span className="text-luxury-gold font-serif">{formatPrice(getUnitPrice(selectedRoom))}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-luxury-silver-muted">Suite Base Rate</span>
                          <span className="text-white font-medium">{formatPrice(getUnitPrice(selectedRoom))} / night</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-silver-muted">Total Nights</span>
                          <span className="text-white font-medium">{getDaysCount()} nights</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 font-bold">
                          <span className="text-luxury-gold uppercase tracking-wider">{t('totalLabel')}</span>
                          <span className="text-luxury-gold font-serif">{formatPrice(getUnitPrice(selectedRoom) * getDaysCount())}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-luxury-gold/25 animate-shine"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Securing Reservation...</span>
                      </>
                    ) : (
                      <span>{t('btnCompleteBooking')}</span>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking Confirmation Modal ─────────────────────────────────────── */}
      {showConfirmModal && selectedRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/5">
              <h2 id="confirm-modal-title" className="text-lg font-serif text-white">Confirm Your Reservation</h2>
              <p className="text-[11px] text-luxury-silver-muted mt-1">Please review your details before confirming.</p>
            </div>

            {/* Guest details */}
            <div className="px-6 py-4 space-y-3 border-b border-white/5">
              <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Guest Information</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Name</span>
                  <span className="text-white font-medium">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Email</span>
                  <span className="text-white font-medium break-all text-right max-w-[60%]">{customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Phone</span>
                  <span className="text-white font-medium">{customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Booking details */}
            <div className="px-6 py-4 space-y-3 border-b border-white/5">
              <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Booking Details</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Hotel</span>
                  <span className="text-white font-medium">{liveHotels.find(h => h.id === selectedHotelId)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Room</span>
                  <span className="text-white font-medium">{selectedRoom.roomName || selectedRoom.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Check-In</span>
                  <span className="text-white font-medium">{checkIn}</span>
                </div>
                {bookingType === 'Day Out' ? (
                  <div className="flex justify-between">
                    <span className="text-luxury-silver-muted">Time Slot</span>
                    <span className="text-amber-400 font-medium">11:00 AM – 5:00 PM</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-luxury-silver-muted">Check-Out</span>
                    <span className="text-white font-medium">{checkOut}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Guests</span>
                  <span className="text-white font-medium">{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-silver-muted">Booking Type</span>
                  <span className={`font-semibold ${bookingType === 'Day Out' ? 'text-amber-400' : 'text-blue-400'}`}>
                    {bookingType === 'Day Out' ? '☀️ Day Out' : '🌙 Night Stay'}
                  </span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-white/5">
              <span className="text-xs text-luxury-silver-muted uppercase tracking-wider">Total Amount</span>
              <span className="text-xl font-serif text-luxury-gold font-bold">
                {formatPrice(bookingType === 'Day Out' ? getUnitPrice(selectedRoom) : getUnitPrice(selectedRoom) * getDaysCount())}
              </span>
            </div>

            {/* Action buttons */}
            <div className="px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border border-white/10 hover:border-white/25 text-luxury-silver-muted hover:text-white rounded text-xs font-sans tracking-widest uppercase transition-all duration-200"
              >
                Edit Details
              </button>
              <button
                onClick={handleConfirmedSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded font-sans font-bold tracking-widest text-xs uppercase transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                <span>{isSubmitting ? 'Confirming...' : 'Confirm & Reserve'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sticky mobile CTA — only shown when a room is selected and not yet on success screen */}
      {selectedRoom && !bookingSuccessData && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-luxury-obsidian/95 backdrop-blur-md border-t border-luxury-obsidian-border px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] text-luxury-silver-muted truncate">{selectedRoom.roomName || selectedRoom.name}</p>
            <p className="text-base font-serif text-luxury-gold font-bold">Rs. {selectedRoom.price?.toLocaleString()}<span className="text-[10px] font-sans font-normal text-luxury-silver-muted">/night</span></p>
          </div>
          <button
            onClick={() => document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="shrink-0 px-5 py-3 bg-luxury-gold text-black rounded font-sans font-bold tracking-widest text-xs uppercase min-h-[44px]"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-luxury-gold animate-spin" />
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
