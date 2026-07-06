"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveHotel } from '@/hooks/useLiveHotels';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { RoomPriceDisplay } from '@/components/RoomPriceDisplay';
import HotelImage from '@/components/HotelImage';
import WhatsAppConfirmModal from '@/components/WhatsAppConfirmModal';
import { MapPin, CheckCircle, ArrowLeft, MessageCircle, Sparkles, Loader2 } from 'lucide-react';

interface HotelDetailPageProps {
  params: {
    slug: string;
  };
}

export default function HotelDetailPage({ params }: HotelDetailPageProps) {
  const router = useRouter();
  const { translateFacility } = useLanguage();
  const { hotel, loading } = useLiveHotel(params.slug);
  const { openWhatsApp, confirmProps } = useWhatsApp();

  if (!hotel && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-serif text-white">Sanctuary Not Found</h1>
        <p className="text-sm text-luxury-silver-muted">The hotel slug you requested does not exist.</p>
        <Link href="/hotels" className="text-xs text-luxury-gold underline tracking-wider uppercase">
          Back to Collection
        </Link>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-luxury-gold animate-spin" />
        <span className="text-xs text-luxury-silver-muted">Loading hotel...</span>
      </div>
    );
  }

  const displayRooms = hotel.rooms;

  const handleBookRedirect = (roomId?: string) => {
    if (roomId) {
      router.push(`/booking?hotel=${hotel.id}&room=${roomId}`);
    } else {
      router.push(`/booking?hotel=${hotel.id}`);
    }
  };

  return (
    <div className="relative min-h-screen">
      <WhatsAppConfirmModal {...confirmProps} />
      <div className="absolute top-6 left-6 md:left-12 z-20">
        <Link
          href="/hotels"
          className="flex items-center space-x-2 text-xs text-white/80 hover:text-luxury-gold transition-colors duration-300 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="tracking-widest uppercase font-sans">Back</span>
        </Link>
      </div>

      {/* HERO */}
      <section className="relative h-[70vh] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HotelImage
            src={hotel.image}
            alt={hotel.name}
            fill
            priority
            className="object-cover object-center scale-100 filter brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full space-y-4">
          <div className="flex items-center space-x-2 text-luxury-gold">
            <MapPin className="h-4.5 w-4.5" />
            <span className="text-xs md:text-sm font-sans font-semibold tracking-wider">{hotel.location}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white">{hotel.name}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-sm md:text-base font-light text-luxury-silver-muted max-w-2xl leading-relaxed">
              {hotel.description}
            </p>
            <button
              onClick={() => handleBookRedirect()}
              className="w-full sm:w-auto px-8 py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 shadow-lg shadow-luxury-gold/20 shrink-0 animate-shine min-h-[50px]"
            >
              Check Stays & Prices
            </button>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl md:text-3xl font-serif text-white">Experience Awaits</h2>
          <p className="text-sm text-luxury-silver-muted leading-relaxed font-light">
            Every corner of {hotel.name} is crafted for comfort and warm hospitality. Enjoy well-appointed rooms,
            modern amenities, and a peaceful setting for your stay.
          </p>
        </div>

        <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border p-6 rounded-lg space-y-6 self-start">
          <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-bold">Resort Features</h4>
          <div className="space-y-4">
            {hotel.facilities.map((fac) => (
              <div key={fac} className="flex items-center space-x-2 text-xs text-luxury-silver">
                <CheckCircle className="h-4 w-4 text-luxury-gold shrink-0" />
                <span>{translateFacility(fac)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/5 space-y-3">
            <button
              type="button"
              onClick={() => openWhatsApp({ hotelName: hotel.name })}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded text-sm font-sans font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 min-h-[50px]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Inquiry</span>
            </button>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="bg-luxury-obsidian-card border-y border-luxury-obsidian-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-4">
            <div className="h-[1px] w-20 bg-luxury-gold mx-auto" />
            <h2 className="text-3xl md:text-5xl font-serif">Rooms & Rates</h2>
            <p className="text-sm font-sans text-luxury-silver-muted max-w-lg mx-auto leading-relaxed">
              {hotel.hasDayoutRates
                ? 'Day-out and overnight packages available. All prices in Sri Lankan Rupees (Rs.).'
                : 'All prices in Sri Lankan Rupees (Rs.) per night.'}
            </p>
            {loading && (
              <div className="flex items-center justify-center space-x-2 text-xs text-luxury-silver-muted">
                <Loader2 className="h-3 w-3 animate-spin text-luxury-gold" />
                <span>Refreshing latest photos & prices...</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {displayRooms.map((room) => (
              <div
                key={room.id}
                className="bg-luxury-obsidian border border-white/5 rounded-lg overflow-hidden flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  <HotelImage
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-serif text-white group-hover:text-luxury-gold transition-colors duration-300">
                      {room.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="text-[9px] font-sans bg-white/5 border border-white/10 text-luxury-silver-muted px-2 py-0.5 rounded"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <RoomPriceDisplay room={room} />
                    <button
                      onClick={() => handleBookRedirect(room.id)}
                      className="w-full sm:w-auto px-5 py-3 text-sm font-sans tracking-widest uppercase font-bold rounded transition-all duration-300 min-h-[44px] bg-luxury-gold hover:bg-luxury-gold-dark text-black"
                    >
                      Book Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {hotel.gallery && hotel.gallery.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-4">
            <div className="h-[1px] w-20 bg-luxury-gold mx-auto" />
            <h2 className="text-3xl md:text-5xl font-serif">Photo Gallery</h2>
            <p className="text-sm font-sans text-luxury-silver-muted max-w-lg mx-auto leading-relaxed">
              Explore every corner of {hotel.name}.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hotel.gallery.map((photo) => (
              <div
                key={photo.url}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/5 group"
              >
                <HotelImage
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold">{photo.category}</p>
                  <p className="text-xs text-white font-serif">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEARBY PLACES */}
      {hotel.nearbyPlaces && hotel.nearbyPlaces.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4.5 w-4.5 text-luxury-gold" />
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Local Curations</span>
            </div>
            <h2 className="text-3xl font-serif text-white">Places You Can Visit</h2>
            <p className="text-sm leading-relaxed text-luxury-silver-muted font-light">
              Popular nearby attractions and landmarks easily reachable from {hotel.name}.
            </p>

            <div className="space-y-4">
              {hotel.nearbyPlaces.map((place) => (
                <div key={place} className="flex items-center space-x-3 border-b border-white/5 pb-3">
                  <MapPin className="h-4 w-4 text-luxury-gold shrink-0" />
                  <h4 className="text-sm text-white font-medium">{place}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl h-72 md:h-96 relative overflow-hidden flex flex-col justify-end p-6 group">
            <div
              className="absolute inset-0 bg-slate-900 filter brightness-50 opacity-40 grayscale"
              style={{
                backgroundImage: `url('${hotel.image}')`,
                backgroundSize: 'cover',
              }}
            />
            <div className="relative z-10 space-y-3 bg-black/60 backdrop-blur-md p-4 rounded border border-white/15">
              <h4 className="text-xs uppercase font-sans tracking-widest text-luxury-gold font-bold">Nearby Attractions</h4>
              <p className="text-[11px] text-luxury-silver-muted leading-relaxed">
                {hotel.nearbyPlaces.join(' · ')}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
