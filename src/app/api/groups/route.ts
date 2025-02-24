import { NextResponse } from 'next/server';
import { GroupService } from '@/services/groups';

export async function GET() {
  try {
    if (
      !process.env.PERMISSION_API_BASE_URL ||
      !process.env.PERMISSION_API_CODE
    ) {
      throw new Error('Missing required environment variables');
    }

    const groups = await GroupService.getGroups();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 },
    );
  }
}
