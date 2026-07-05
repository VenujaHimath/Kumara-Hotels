import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, currentPassword, newPassword } = body;

    if (!id || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields (id, currentPassword, newPassword) are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Fetch the admin record including password for verification
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { id: true, password: true, name: true },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Account not found.' },
        { status: 404 }
      );
    }

    // Verify current password — supports both bcrypt-hashed and legacy plain-text
    const isHashed = admin.password.startsWith('$2');
    const currentPasswordValid = isHashed
      ? await bcrypt.compare(currentPassword, admin.password)
      : admin.password === currentPassword;

    if (!currentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect. Please try again.' },
        { status: 401 }
      );
    }

    // Prevent setting the same password
    const isSamePassword = isHashed
      ? await bcrypt.compare(newPassword, admin.password)
      : admin.password === newPassword;

    if (isSamePassword) {
      return NextResponse.json(
        { success: false, error: 'New password must be different from current password.' },
        { status: 400 }
      );
    }

    // Hash the new password and persist
    const hashedNew = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id },
      data: { password: hashedNew },
    });

    return NextResponse.json({
      success: true,
      message: `Password updated successfully for ${admin.name}.`,
    });

  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error while updating password.' },
      { status: 500 }
    );
  }
}
