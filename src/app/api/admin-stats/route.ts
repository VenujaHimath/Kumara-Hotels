import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalHotels = await prisma.hotel.count();
    const totalRooms = await prisma.room.count();
    
    const bookings = await prisma.booking.findMany({
      include: {
        hotel: true,
        room: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalBookingsCount = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === "Confirmed");
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const bookedRoomsCount = await prisma.room.count({
      where: { status: 'Booked' }
    });
    
    const occupancyRate = totalRooms > 0 
      ? Math.round((bookedRoomsCount / totalRooms) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalHotels,
        totalRooms,
        totalBookingsCount,
        totalRevenue,
        occupancyRate,
        recentBookings: bookings.slice(0, 5).map(b => ({
          id: b.id,
          customerName: b.customerName,
          hotelName: b.hotel.name,
          checkIn: b.checkIn.toISOString().split('T')[0],
          totalPrice: b.totalAmount,
          status: b.status
        }))
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Database query error generating stats.' },
      { status: 500 }
    );
  }
}
