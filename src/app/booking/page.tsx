"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { hotels } from '@/data/hotelsData';
import { RoomPriceDisplay } from '@/components/RoomPriceDisplay';
import { formatPrice } from '@/lib/formatPrice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<any>(null);

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
        const matchedRoom = matchedHotel.rooms.find((r: any) => r.id === paramRoom);
        if (matchedRoom) {
          setSelectedRoom(matchedRoom);
          setHasSearched(true);
          setAvailableRooms(matchedHotel.rooms.filter((r: any) => r.status === 'Available'));
        }
      }
    }
  }, [paramHotel, paramRoom, liveHotels]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) return;

    setIsSearching(true);

    try {
      // Fetch fresh room data from DB to get live availability
      const res = await fetch(`/api/hotels?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json.success) {
        setLiveHotels(json.data);
        const matchedHotel = json.data.find((h: any) => h.id === selectedHotelId);
        if (matchedHotel) {
          const rooms = matchedHotel.rooms.filter(
            (r: any) => r.status === 'Available' && r.capacity >= parseInt(guests)
          );
          setAvailableRooms(rooms);
        } else {
          setAvailableRooms([]);
        }
      }
    } catch (e) {
      // Fallback to local state
      const matchedHotel = liveHotels.find((h: any) => h.id === selectedHotelId);
      if (matchedHotel) {
        const rooms = matchedHotel.rooms.filter(
          (r: any) => r.status === 'Available' && r.capacity >= parseInt(guests)
        );
        setAvailableRooms(rooms);
      } else {
        setAvailableRooms([]);
      }
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId || !selectedRoom) return;

    setIsSubmitting(true);

    const bookingPayload = {
      customerName,
      phone: customerPhone,
      email: customerEmail,
      hotelId: selectedHotelId,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guests: parseInt(guests),
      totalPrice: selectedRoom.price * getDaysCount()
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

  const selectedHotel = liveHotels.find(h => h.id === selectedHotelId);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-10">
      
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
                    {bookingSuccessData.checkIn?.split('T')[0] || bookingSuccessData.checkIn} to {bookingSuccessData.checkOut?.split('T')[0] || bookingSuccessData.checkOut}
                  </span>
                </div>
                <div>
                  <span className="text-luxury-silver-muted block">Guests Number</span>
                  <span className="text-white font-semibold">{bookingSuccessData.guests} Adults</span>
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
            <form onSubmit={handleSearch} className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-5 gap-6 items-end shadow-2xl">
              <div>
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {t('selectHotel')}
                </label>
                {hotelsLoading ? (
                  <div className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-luxury-gold" />
                    <span className="text-xs text-luxury-silver-muted">Loading...</span>
                  </div>
                ) : (
                  <select
                    value={selectedHotelId}
                    onChange={(e) => setSelectedHotelId(e.target.value)}
                    required
                    className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                  >
                    <option value="">-- Select Destination --</option>
                    {liveHotels.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {t('checkIn')}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {t('checkOut')}
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold block mb-2">
                  {t('guests') || 'Guests'}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-luxury-obsidian border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-luxury-gold/10"
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
                  {t('availableRooms')} ({availableRooms.length})
                </h2>

                {availableRooms.length === 0 ? (
                  <div className="text-center py-12 bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg space-y-2">
                    <p className="text-sm text-luxury-silver-muted">No accommodations match your capacity requirements.</p>
                    <p className="text-xs text-luxury-gold">Try reducing guest size or exploring other dates.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {availableRooms.map((room) => {
                      const isSelected = selectedRoom?.id === room.id;
                      return (
                        <div
                          key={room.id}
                          className={`bg-luxury-obsidian-card border rounded-lg overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                            isSelected ? 'border-luxury-gold ring-1 ring-luxury-gold' : 'border-white/5'
                          }`}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={room.image}
                              alt={room.roomName || room.name}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                            <div className="space-y-2">
                              <h3 className="text-lg font-serif text-white">{room.roomName || room.name}</h3>
                              <div className="flex flex-wrap gap-1">
                                {(room.facilities || '').toString().split(',').filter(Boolean).map((fac: string) => (
                                  <span key={fac} className="text-[9px] bg-white/5 text-luxury-silver px-2 py-0.5 rounded">
                                    {fac.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-white/5 flex items-end justify-between gap-3">
                              <div>
                                <span className="text-xs text-luxury-silver-muted">From</span>
                                <p className="text-lg font-serif text-luxury-gold font-bold">
                                  Rs. {room.price?.toLocaleString()}
                                  <span className="text-[10px] text-luxury-silver-muted font-sans font-normal">/night</span>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSelectRoom(room)}
                                className={`px-4 py-2 text-xs font-sans tracking-widest uppercase font-bold rounded transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white/5 hover:bg-luxury-gold hover:text-black text-white'
                                }`}
                              >
                                {isSelected ? 'Selected ✓' : 'Select'}
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
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        placeholder="e.g. John Doe"
                        className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                      />
                    </div>
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
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          required
                          placeholder="e.g. name@domain.com"
                          className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                        />
                      </div>
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
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          required
                          placeholder="e.g. +94 77 123 4567"
                          className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-luxury-silver-muted">Suite Base Rate</span>
                      <span className="text-white font-medium">{formatPrice(selectedRoom.price)} / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-luxury-silver-muted">Total Nights</span>
                      <span className="text-white font-medium">{getDaysCount()} nights</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-2 font-bold">
                      <span className="text-luxury-gold uppercase tracking-wider">Total Investment</span>
                      <span className="text-luxury-gold font-serif">{formatPrice(selectedRoom.price * getDaysCount())}</span>
                    </div>
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
