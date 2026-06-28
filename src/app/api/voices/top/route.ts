import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Top 3 = the recordings with the most likes (ties broken by dislikes asc).
    const topVoices = await db.voiceRecording.findMany({
      where: {
        isDeleted: false,
        likes: { gte: 1 },
      },
      orderBy: [{ likes: 'desc' }, { dislikes: 'asc' }],
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        dialect: true,
        fileName: true,
        filePath: true,
        duration: true,
        nickname: true,
        vocabId: true,
        likes: true,
        dislikes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ voices: topVoices });
  } catch (error) {
    console.error('Top voices error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'A server error occurred.' },
      { status: 500 }
    );
  }
}