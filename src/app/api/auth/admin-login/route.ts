import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, employeeId, password } = body;

    if (!password || (!email && !employeeId)) {
      return NextResponse.json(
        { success: false, error: 'Email or Employee ID and password are required.' },
        { status: 400 }
      );
    }

    // Find admin by email or employee ID
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          ...(email ? [{ email: email.toLowerCase() }] : []),
          ...(employeeId ? [{ employeeId: employeeId }] : []),
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'No admin account found with the provided credentials.' },
        { status: 401 }
      );
    }

    // Verify password using bcrypt. Supports both hashed passwords and legacy
    // plain-text passwords (for accounts not yet migrated).
    const isHashed = admin.password.startsWith('$2');
    const passwordValid = isHashed
      ? await bcrypt.compare(password, admin.password)
      : admin.password === password;

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password. Access denied.' },
        { status: 401 }
      );
    }

    // Migrate legacy plain-text password to bcrypt hash on first successful login
    if (!isHashed) {
      const hashed = await bcrypt.hash(password, 12);
      await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });
    }

    // Verify access status
    if (!admin.hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access suspended. Please contact the primary administrator.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin access granted.',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        employeeId: admin.employeeId,
        role: admin.role,
        hasAccess: admin.hasAccess,
      },
    });

  } catch (error: unknown) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error during authentication.' },
      { status: 500 }
    );
  }
}
