import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/user/voices
 * Returns all voice recordings owned by the authenticated user.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const voices = await db.voiceRecording.findMany({
      where: { userId: session.user.id, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        dialect: true,
        filePath: true,
        duration: true,
        nickname: true,
        vocabId: true,
        likes: true,
        dislikes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ voices });
  } catch (error) {
    console.error('User voices error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'A server error occurred.' },
      { status: 500 }
    );
  }
}
