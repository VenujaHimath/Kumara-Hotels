/**
 * Maps raw Prisma DB records to the display shape used throughout the UI.
 * Using explicit structural types here avoids importing the full Prisma client
 * on the client side while still being fully type-safe.
 */

/** Raw Room row as returned by Prisma (all fields we rely on). */
interface DbRoom {
  id: string;
  roomName: string;
  price: number;
  dayoutPrice: number | null;
  capacity: number;
  image: string;
  facilities: string;
  status: string;
  totalUnits: number | null;
}

/** Raw Hotel row as returned by Prisma (all fields we rely on). */
interface DbHotel {
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
  rooms?: DbRoom[];
}

export function mapDbRoomToDisplay(room: DbRoom) {
  return {
    id: room.id,
    name: room.roomName,
    price: room.price,
    dayoutPrice: room.dayoutPrice ?? undefined,
    capacity: room.capacity,
    image: room.image,
    facilities: room.facilities
      ? room.facilities.split(',').map((f: string) => f.trim()).filter(Boolean)
      : [],
    status: room.status as 'Available' | 'Booked' | 'Maintenance',
    totalUnits: room.totalUnits ?? 1,
  };
}

export function mapDbHotelToDisplay(hotel: DbHotel) {
  return {
    id: hotel.id,
    slug: hotel.slug || hotel.id,
    name: hotel.name,
    location: hotel.location,
    description: hotel.description,
    image: hotel.image,
    facilities: hotel.facilities
      ? hotel.facilities.split(',').map((f: string) => f.trim()).filter(Boolean)
      : [],
    hasDayoutRates: hotel.hasDayoutRates || false,
    nearbyPlaces: hotel.nearbyPlaces
      ? hotel.nearbyPlaces.split(',').map((p: string) => p.trim()).filter(Boolean)
      : [],
    gallery: hotel.gallery
      ? (() => {
          try {
            return JSON.parse(hotel.gallery as string) as { url: string; title: string; category: string }[];
          } catch {
            return [];
          }
        })()
      : [],
    rooms: (hotel.rooms || []).map(mapDbRoomToDisplay),
  };
}
