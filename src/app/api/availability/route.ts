import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const guests = parseInt(searchParams.get('guests') || '2');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const bookingType = searchParams.get('bookingType') || 'Night Stay';

    if (!hotelId) {
      return NextResponse.json(
        { success: false, error: 'hotelId parameter is required.' },
        { status: 400 }
      );
    }

    // Parse requested period
    // For Day Out: checkIn and checkOut are the same date (6-hour window same day)
    const requestedCheckIn = checkInParam ? new Date(checkInParam) : null;
    const requestedCheckOut = checkOutParam
      ? new Date(checkOutParam)
      : checkInParam
        ? new Date(new Date(checkInParam).setHours(23, 59, 59, 999)) // end of same day
        : null;

    // Fetch all rooms that meet capacity — include Booked ones so we can show them as full
    const rooms = await prisma.room.findMany({
      where: {
        hotelId,
        status: { in: ['Available', 'Booked', 'Maintenance'] },
        capacity: { gte: guests },
      },
    });

    // For each room, count ONLY the Confirmed bookings that overlap the requested period.
    // Two periods overlap when: existingCheckIn < requestedCheckOut AND existingCheckOut > requestedCheckIn
    // If no dates provided, fall back to counting all confirmed bookings (legacy behaviour).
    const roomsWithAvailability = await Promise.all(
      rooms.map(async (r) => {
        let overlappingCount = 0;

        if (requestedCheckIn && requestedCheckOut) {
          overlappingCount = await prisma.booking.count({
            where: {
              roomId: r.id,
              status: 'Confirmed',
              // Standard overlap condition
              checkIn:  { lt: requestedCheckOut },
              checkOut: { gt: requestedCheckIn  },
            },
          });
        } else {
          // No dates given — count all confirmed bookings
          overlappingCount = await prisma.booking.count({
            where: { roomId: r.id, status: 'Confirmed' },
          });
        }

        const totalUnits = r.totalUnits ?? 1;
        const remaining = Math.max(0, totalUnits - overlappingCount);
        const fullyBooked = r.status === 'Maintenance' || remaining === 0;

        return {
          id: r.id,
          name: r.roomName,
          price: r.price,
          dayoutPrice: r.dayoutPrice,
          capacity: r.capacity,
          image: r.image,
          facilities: r.facilities.split(',').map(f => f.trim()),
          status: r.status,
          totalUnits,
          bookedCount: overlappingCount,
          remainingUnits: remaining,
          fullyBooked,
          maintenance: r.status === 'Maintenance',
        };
      })
    );

    // Filter out maintenance rooms from the results shown to customers
    const customerRooms = roomsWithAvailability.filter(r => !r.maintenance);

    return NextResponse.json({
      success: true,
      data: customerRooms,
    });

  } catch (error: unknown) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Database error fetching availability details.' },
      { status: 500 }
    );
  }
}
