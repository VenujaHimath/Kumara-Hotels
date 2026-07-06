'use client';

import { useState, useEffect, useCallback } from 'react';
import { hotels as staticHotels } from '@/data/hotelsData';
import { mapDbHotelToDisplay } from '@/lib/hotelMapper';

export type DisplayHotel = ReturnType<typeof mapDbHotelToDisplay>;

/** Minimal shape of a raw hotel object returned by /api/hotels (Prisma row). */
interface RawDbHotel {
  id: string;
  slug: string | null;
  name: string;
  location: string;
  description: string;
  image: string;
  facilities: string;
  hasDayoutRates: boolean;
  nearbyPlaces: string | null;
  gallery: string | null;
  rooms?: {
    id: string;
    roomName: string;
    price: number;
    dayoutPrice: number | null;
    capacity: number;
    image: string;
    facilities: string;
    status: string;
    totalUnits: number | null;
  }[];
}

function mergeWithStatic(dbHotels: RawDbHotel[]): DisplayHotel[] {
  const mapped = dbHotels.map(mapDbHotelToDisplay);

  if (mapped.length === 0) {
    return staticHotels.map((h) => ({
      id: h.id,
      slug: h.slug,
      name: h.name,
      location: h.location,
      description: h.description,
      image: h.image,
      facilities: h.facilities,
      hasDayoutRates: h.hasDayoutRates || false,
      nearbyPlaces: h.nearbyPlaces || [],
      gallery: h.gallery || [],
      rooms: h.rooms.map((r) => ({
        id: r.id,
        name: r.name,
        price: r.price,
        dayoutPrice: r.dayoutPrice,
        capacity: r.capacity,
        image: r.image,
        facilities: r.facilities,
        status: r.status,
        totalUnits: 1,
      })),
    }));
  }

  // DB is source of truth; fill slug from static when missing
  return mapped.map((db) => {
    const stat = staticHotels.find((s) => s.id === db.id);
    return {
      ...db,
      slug: db.slug && db.slug !== db.id ? db.slug : stat?.slug || db.slug,
    };
  });
}

export function useLiveHotels() {
  const [hotels, setHotels] = useState<DisplayHotel[]>(() =>
    staticHotels.map((h) => ({
      id: h.id,
      slug: h.slug,
      name: h.name,
      location: h.location,
      description: h.description,
      image: h.image,
      facilities: h.facilities,
      hasDayoutRates: h.hasDayoutRates || false,
      nearbyPlaces: h.nearbyPlaces || [],
      gallery: h.gallery || [],
      rooms: h.rooms.map((r) => ({
        id: r.id,
        name: r.name,
        price: r.price,
        dayoutPrice: r.dayoutPrice,
        capacity: r.capacity,
        image: r.image,
        facilities: r.facilities,
        status: r.status,
        totalUnits: 1,
      })),
    }))
  );
  const [loading, setLoading] = useState(true);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json.success && json.data?.length > 0) {
        setHotels(mergeWithStatic(json.data as RawDbHotel[]));
      }
    } catch (e) {
      console.error('Failed to fetch live hotels:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return { hotels, loading, refetch: fetchHotels };
}

export function useLiveHotel(slug: string) {
  const { hotels, loading, refetch } = useLiveHotels();
  const hotel = hotels.find((h) => h.slug === slug || h.id === slug) ?? null;
  return { hotel, loading, refetch };
}
