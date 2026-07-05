export function mapDbRoomToDisplay(room: any) {
  return {
    id: room.id,
    name: room.roomName,
    price: room.price,
    dayoutPrice: room.dayoutPrice ?? undefined,
    capacity: room.capacity,
    image: room.image,
    facilities: room.facilities ? room.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [],
    status: room.status as 'Available' | 'Booked' | 'Maintenance',
    totalUnits: room.totalUnits ?? 1,
  };
}

export function mapDbHotelToDisplay(hotel: any) {
  return {
    id: hotel.id,
    slug: hotel.slug || hotel.id,
    name: hotel.name,
    location: hotel.location,
    description: hotel.description,
    image: hotel.image,
    facilities: hotel.facilities ? hotel.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [],
    hasDayoutRates: hotel.hasDayoutRates || false,
    nearbyPlaces: hotel.nearbyPlaces
      ? hotel.nearbyPlaces.split(',').map((p: string) => p.trim()).filter(Boolean)
      : [],
    gallery: hotel.gallery
      ? (() => {
          try {
            return JSON.parse(hotel.gallery);
          } catch {
            return [];
          }
        })()
      : [],
    rooms: (hotel.rooms || []).map(mapDbRoomToDisplay),
  };
}
