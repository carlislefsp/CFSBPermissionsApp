import { NextResponse } from 'next/server';
import { UserService } from '@/services/users';

export async function GET(
  request: Request,
  { params }: { params: { userId: Promise<string> } },
) {
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

    const userId = await params.userId;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    const groups = await UserService.getUserGroups(userId);
    return NextResponse.json(groups || []);
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
