import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, email, hotelId, roomId, checkIn, checkOut, guests, totalPrice } = body;

    if (!customerName || !phone || !email || !hotelId || !roomId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory reservation parameters.' },
        { status: 400 }
      );
    }

    // Date validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // compare date only, not time

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid check-in or check-out date format.' },
        { status: 400 }
      );
    }

    if (checkInDate < today) {
      return NextResponse.json(
        { success: false, error: 'Check-in date cannot be in the past.' },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { success: false, error: 'Check-out date must be after check-in date.' },
        { status: 400 }
      );
    }

    // Generate a unique reservationId in standard format (e.g. RES-123456)
    const reservationId = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create the booking entry in PostgreSQL using Prisma
    const newBooking = await prisma.booking.create({
      data: {
        reservationId,
        customerName,
        phone,
        email,
        hotelId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        status: 'Confirmed', // Default confirmed for direct bookings
        totalAmount: parseFloat(totalPrice) || 0
      },
      include: {
        hotel: true,
        room: true
      }
    });

    // Automatically toggle room status to Booked
    await prisma.room.update({
      where: { id: roomId },
      data: { status: 'Booked' }
    });

    return NextResponse.json({
      success: true,
      message: 'Booking generated successfully.',
      data: {
        id: newBooking.id,
        reservationId: newBooking.reservationId,
        customerName: newBooking.customerName,
        email: newBooking.email,
        phone: newBooking.phone,
        hotelName: newBooking.hotel.name,
        roomName: newBooking.room.roomName,
        checkIn: newBooking.checkIn.toISOString().split('T')[0],
        checkOut: newBooking.checkOut.toISOString().split('T')[0],
        guests: newBooking.guests,
        totalPrice: newBooking.totalAmount
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error creating booking.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        hotel: true,
        room: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Could not fetch bookings log.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, error: 'bookingId and status parameters are required.' },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        hotel: true,
        room: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully.',
      data: updatedBooking
    });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error updating booking status.' },
      { status: 500 }
    );
  }
}
