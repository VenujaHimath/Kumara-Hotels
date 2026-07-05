import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hotelId, roomName, price, dayoutPrice, capacity, status, image, facilities } = body;

    if (!hotelId || !roomName || price === undefined || !capacity || !image) {
      return NextResponse.json(
        { success: false, error: 'hotelId, roomName, price, capacity, and image are required.' },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        hotelId,
        roomName,
        price: parseFloat(price),
        dayoutPrice: dayoutPrice != null ? parseFloat(dayoutPrice) : null,
        capacity: parseInt(capacity),
        status: status || 'Available',
        image,
        facilities: facilities || '',
      },
    });

    return NextResponse.json({ success: true, data: room, message: 'Room created successfully.' });
  } catch (error: any) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create room.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { roomId, status, roomName, price, dayoutPrice, capacity, image, facilities } = body;

    if (!roomId) {
      return NextResponse.json({ success: false, error: 'roomId is required.' }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (roomName !== undefined) data.roomName = roomName;
    if (price !== undefined) data.price = parseFloat(price);
    if (dayoutPrice !== undefined) data.dayoutPrice = dayoutPrice === null || dayoutPrice === '' ? null : parseFloat(dayoutPrice);
    if (capacity !== undefined) data.capacity = parseInt(capacity);
    if (image !== undefined) data.image = image;
    if (facilities !== undefined) data.facilities = facilities;

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data,
    });

    return NextResponse.json({ success: true, data: updatedRoom, message: 'Room updated successfully.' });
  } catch (error: any) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update room.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({ success: false, error: 'roomId is required.' }, { status: 400 });
    }

    await prisma.room.delete({ where: { id: roomId } });

    return NextResponse.json({ success: true, message: 'Room deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete room.' },
      { status: 500 }
    );
  }
}
