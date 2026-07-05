import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, email, hotelId, roomId, checkIn, checkOut, guests, totalPrice, bookingType } = body;

    if (!customerName || !phone || !email || !hotelId || !roomId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory reservation parameters.' },
        { status: 400 }
      );
    }

    // bookingType validation
    const validBookingTypes = ['Night Stay', 'Day Out'];
    const resolvedBookingType = bookingType && validBookingTypes.includes(bookingType) ? bookingType : null;
    if (!resolvedBookingType) {
      return NextResponse.json(
        { success: false, error: 'Please select a booking type: Night Stay or Day Out.' },
        { status: 400 }
      );
    }

    // Phone validation — exactly 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be exactly 10 digits (e.g. 0771234567).' },
        { status: 400 }
      );
    }

    // Email validation — must match user@domain.tld pattern
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address (e.g. yourname@gmail.com).' },
        { status: 400 }
      );
    }

    // Date validation
    const checkInDate = new Date(checkIn);
    // For Day Out: ignore any client-sent checkOut — always set to checkIn + 6 hours (11am→5pm window)
    const checkOutDate = resolvedBookingType === 'Day Out'
      ? new Date(new Date(checkIn).setHours(new Date(checkIn).getHours() + 6))
      : new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid check-in date format.' },
        { status: 400 }
      );
    }

    if (checkInDate < today) {
      return NextResponse.json(
        { success: false, error: 'Check-in date cannot be in the past.' },
        { status: 400 }
      );
    }

    // Only validate check-out for Night Stay
    if (resolvedBookingType === 'Night Stay') {
      if (isNaN(checkOutDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid check-out date format.' },
          { status: 400 }
        );
      }
      if (checkOutDate <= checkInDate) {
        return NextResponse.json(
          { success: false, error: 'Check-out date must be after check-in date.' },
          { status: 400 }
        );
      }
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
        status: 'Confirmed',
        bookingType: resolvedBookingType,
        totalAmount: parseFloat(totalPrice) || 0
      },
      include: { hotel: true, room: true }
    });

    // Only mark room as Booked if all units are now taken by active/future bookings
    const now = new Date();
    const confirmedCount = await prisma.booking.count({
      where: {
        roomId,
        status: 'Confirmed',
        checkOut: { gt: now }, // only future/ongoing bookings
      },
    });

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    const totalUnits = room?.totalUnits ?? 1;

    if (confirmedCount >= totalUnits) {
      await prisma.room.update({
        where: { id: roomId },
        data: { status: 'Booked' },
      });
    }
    // If there are still free units, leave status as Available

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
        bookingType: newBooking.bookingType,
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

    // Re-evaluate room status after a booking status change
    const roomData = await prisma.room.findUnique({ where: { id: updatedBooking.roomId } });
    const totalUnits = roomData?.totalUnits ?? 1;

    if (status === 'Cancelled') {
      // Count remaining confirmed bookings for this room
      const confirmedCount = await prisma.booking.count({
        where: { roomId: updatedBooking.roomId, status: 'Confirmed' },
      });
      // If still below capacity (or at 0), restore to Available
      // Note: only update if room isn't under Maintenance
      if (roomData?.status !== 'Maintenance' && confirmedCount < totalUnits) {
        await prisma.room.update({
          where: { id: updatedBooking.roomId },
          data: { status: 'Available' },
        });
      }
    } else if (status === 'Confirmed') {
      // If re-confirming, check if we've now hit full capacity
      const confirmedCount = await prisma.booking.count({
        where: { roomId: updatedBooking.roomId, status: 'Confirmed' },
      });
      if (roomData?.status !== 'Maintenance' && confirmedCount >= totalUnits) {
        await prisma.room.update({
          where: { id: updatedBooking.roomId },
          data: { status: 'Booked' },
        });
      }
    }

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
