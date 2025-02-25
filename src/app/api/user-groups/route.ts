import { NextResponse } from 'next/server';
import { UserService } from '@/services/users';

export async function GET() {
  try {
    if (
      !process.env.PERMISSION_API_BASE_URL ||
      !process.env.PERMISSION_API_CODE
    ) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 },
      );
    }

    const userGroups = await UserService.getAllUserGroups();
    return NextResponse.json(userGroups || {});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
