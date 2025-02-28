import { NextResponse } from 'next/server';
import { UserService } from '@/services/users';

export async function GET() {
  try {
    console.log('API Config:', {
      baseUrl: process.env.PERMISSION_API_BASE_URL,
      hasApiCode: !!process.env.PERMISSION_API_CODE,
    });

    if (
      !process.env.PERMISSION_API_BASE_URL ||
      !process.env.PERMISSION_API_CODE
    ) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 },
      );
    }

    console.log('Fetching all user groups...');
    const userGroups = await UserService.getAllUserGroups();
    console.log('Successfully fetched user groups');
    return NextResponse.json(userGroups || {});
  } catch (error) {
    console.error('Error in user-groups API route:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
