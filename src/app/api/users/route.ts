import { NextResponse } from 'next/server';
import { UserService } from '@/services/users';

export async function GET() {
  try {
    // Validate environment variables
    if (
      !process.env.PERMISSION_API_BASE_URL ||
      !process.env.PERMISSION_API_CODE
    ) {
      throw new Error('Missing required environment variables');
    }

    const users = await UserService.getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}
