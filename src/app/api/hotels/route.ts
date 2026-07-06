import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred.';
}

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: { rooms: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(
      { success: true, data: hotels },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: unknown) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { success: false, error: 'Database error fetching hotels collection.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { hotelId, name, location, description, image, facilities, nearbyPlaces, gallery, hasDayoutRates } = body;

    if (!hotelId) {
      return NextResponse.json({ success: false, error: 'hotelId is required.' }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (location !== undefined) data.location = location;
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (facilities !== undefined) data.facilities = facilities;
    if (nearbyPlaces !== undefined) data.nearbyPlaces = nearbyPlaces;
    if (gallery !== undefined) data.gallery = typeof gallery === 'string' ? gallery : JSON.stringify(gallery);
    if (hasDayoutRates !== undefined) data.hasDayoutRates = hasDayoutRates;

    const updated = await prisma.hotel.update({
      where: { id: hotelId },
      data,
      include: { rooms: true },
    });

    return NextResponse.json({ success: true, data: updated, message: 'Hotel updated successfully.' });
  } catch (error: unknown) {
    console.error('Error updating hotel:', error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) || 'Failed to update hotel.' },
      { status: 500 }
    );
  }
}
