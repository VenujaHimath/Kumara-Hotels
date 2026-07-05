import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const guests = parseInt(searchParams.get('guests') || '2');

    if (!hotelId) {
      return NextResponse.json(
        { success: false, error: 'hotelId parameter is required.' },
        { status: 400 }
      );
    }

    // Query database for rooms associated with the hotel that are not marked booked/maintenance
    const rooms = await prisma.room.findMany({
      where: {
        hotelId: hotelId,
        status: 'Available',
        capacity: {
          gte: guests
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: rooms.map(r => ({
        id: r.id,
        name: r.roomName,
        price: r.price,
        capacity: r.capacity,
        image: r.image,
        facilities: r.facilities.split(',').map(f => f.trim()),
        status: r.status
      }))
    });

  } catch (error: any) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Database error fetching availability details.' },
      { status: 500 }
    );
  }
}
