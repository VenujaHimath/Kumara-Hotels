import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred.';
}

export async function GET() {
  try {
    const accounts = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        employeeId: true,
        role: true,
        hasAccess: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: accounts,
    });
  } catch (error: unknown) {
    console.error('Error fetching admin accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Database error fetching administrative accounts.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, hasAccess, role } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required.' },
        { status: 400 }
      );
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        ...(hasAccess !== undefined ? { hasAccess } : {}),
        ...(role !== undefined ? { role } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        employeeId: true,
        role: true,
        hasAccess: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account updated successfully.',
      data: updatedAdmin,
    });
  } catch (error: unknown) {
    console.error('Error updating admin account:', error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) || 'Database error updating administrative account.' },
      { status: 500 }
    );
  }
}
