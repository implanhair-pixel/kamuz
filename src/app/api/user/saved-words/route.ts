import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';

// GET /api/user/saved-words - Get user's saved words
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const savedWords = await db.savedWord.findMany({
      where: { userId: session.user.id },
      select: { vocabId: true, savedAt: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ savedWords });
  } catch (error) {
    console.error('Error fetching saved words:', error);
    return NextResponse.json({ error: 'failed to fetch saved words' }, { status: 500 });
  }
}

// POST /api/user/saved-words - Sync saved words (add/remove)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vocabIds, savedAt } = body as { vocabIds: string[]; savedAt: string };

    if (!Array.isArray(vocabIds)) {
      return NextResponse.json({ error: 'invalid vocabIds' }, { status: 400 });
    }

    const userId = session.user.id;
    const today = savedAt || new Date().toISOString().split('T')[0];

    // Delete all existing saved words for this user
    await db.savedWord.deleteMany({ where: { userId } });

    // Insert new saved words in batch
    if (vocabIds.length > 0) {
      await db.savedWord.createMany({
        data: vocabIds.map((vocabId) => ({
          userId,
          vocabId,
          savedAt: today
        })),
        skipDuplicates: true
      });
    }

    return NextResponse.json({ success: true, count: vocabIds.length });
  } catch (error) {
    console.error('Error syncing saved words:', error);
    return NextResponse.json({ error: 'failed to sync saved words' }, { status: 500 });
  }
}
