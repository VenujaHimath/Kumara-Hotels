import React from 'react';
import { RoomData } from '@/data/hotelsData';
import { formatPrice } from '@/lib/formatPrice';

interface RoomPriceDisplayProps {
  room: any; // Accept both static RoomData and live DB room objects
  variant?: 'card' | 'inline';
}

export function RoomPriceDisplay({ room, variant = 'card' }: RoomPriceDisplayProps) {
  if (room.dayoutPrice !== undefined) {
    if (variant === 'inline') {
      return (
        <span className="text-luxury-gold font-serif font-bold">
          Day Out {formatPrice(room.dayoutPrice)} · Night {formatPrice(room.price)}
        </span>
      );
    }

    return (
      <div className="space-y-1">
        <div>
          <span className="text-[9px] font-sans tracking-widest text-luxury-silver-muted uppercase">Day Out</span>
          <span className="text-lg font-serif text-luxury-gold font-bold block">{formatPrice(room.dayoutPrice)}</span>
        </div>
        <div>
          <span className="text-[9px] font-sans tracking-widest text-luxury-silver-muted uppercase">Night</span>
          <span className="text-lg font-serif text-luxury-gold font-bold block">{formatPrice(room.price)}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="text-[10px] font-sans tracking-widest text-luxury-silver-muted block uppercase">Per Night</span>
      <span className={`font-serif text-luxury-gold font-bold ${variant === 'inline' ? 'text-base' : 'text-xl'}`}>
        {formatPrice(room.price)}
      </span>
    </div>
  );
}

export function getLowestRoomPrice(rooms: RoomData[]): number {
  if (!rooms || rooms.length === 0) return 0;
  return Math.min(...rooms.map((r) => r.dayoutPrice ?? r.price));
}
