import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { hashIP, checkRateLimit, incrementRateLimit } from '@/lib/rate-limit';

type RatingKind = 'like' | 'dislike';

function parseKind(value: unknown): RatingKind | null {
  if (value !== 'like' && value !== 'dislike') return null;
  return value;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Authentication is required for rating.
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Please sign in to rate.' },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const ipHash = hashIP(request);

    // Light rate limit: max 60 votes per day per user.
    const canRate = await checkRateLimit(ipHash, 'voice_rate', 60);
    if (!canRate) {
      return NextResponse.json(
        { error: 'rate_limit', message: 'Too many votes today. Try again later.' },
        { status: 429 }
      );
    }

    // Validate voice exists.
    const voice = await db.voiceRecording.findUnique({ where: { id } });
    if (!voice || voice.isDeleted) {
      return NextResponse.json(
        { error: 'not_found', message: 'Voice not found.' },
        { status: 404 }
      );
    }

    // Users can't vote on their own recordings.
    // If the voice has a userId (authenticated upload), compare against the
    // current session. Otherwise (legacy anonymous uploads), fall back to IP.
    const isOwnVoice = voice.userId
      ? voice.userId === userId
      : voice.ipHash === ipHash;
    if (isOwnVoice) {
      return NextResponse.json(
        { error: 'own_voice', message: 'You cannot vote on your own recording.' },
        { status: 403 }
      );
    }

    // Parse body for the requested kind.
    const body = await request.json().catch(() => ({}));
    const kind = parseKind(body?.kind);
    if (!kind) {
      return NextResponse.json(
        { error: 'invalid_kind', message: "kind must be 'like' or 'dislike'." },
        { status: 400 }
      );
    }

    // Look up existing vote by this user (authenticated votes are keyed on userId).
    const existing = await db.voiceRating.findUnique({
      where: { voiceId_userId: { voiceId: id, userId } },
    });

    if (existing) {
      if (existing.kind === kind) {
        // Same kind → toggle off (remove the vote entirely).
        await db.voiceRating.delete({ where: { id: existing.id } });
        const delta = kind === 'like' ? -1 : -1;
        const updated = await db.voiceRecording.update({
          where: { id },
          data:
            kind === 'like'
              ? { likes: Math.max(0, voice.likes + delta) }
              : { dislikes: Math.max(0, voice.dislikes + delta) },
          select: { likes: true, dislikes: true },
        });
        return NextResponse.json({
          success: true,
          action: 'removed',
          kind,
          likes: updated.likes,
          dislikes: updated.dislikes,
        });
      }

      // Different kind → flip the vote.
      await db.voiceRating.update({
        where: { id: existing.id },
        data: { kind, userId, ipHash },
      });
      const updated = await db.voiceRecording.update({
        where: { id },
        data:
          kind === 'like'
            ? { likes: voice.likes + 1, dislikes: Math.max(0, voice.dislikes - 1) }
            : { dislikes: voice.dislikes + 1, likes: Math.max(0, voice.likes - 1) },
        select: { likes: true, dislikes: true },
      });
      return NextResponse.json({
        success: true,
        action: 'flipped',
        kind,
        likes: updated.likes,
        dislikes: updated.dislikes,
      });
    }

    // No existing vote → create a new one.
    await db.voiceRating.create({
      data: { voiceId: id, kind, userId, ipHash },
    });
    const updated = await db.voiceRecording.update({
      where: { id },
      data: kind === 'like' ? { likes: voice.likes + 1 } : { dislikes: voice.dislikes + 1 },
      select: { likes: true, dislikes: true },
    });
    await incrementRateLimit(ipHash, 'voice_rate');

    return NextResponse.json({
      success: true,
      action: 'added',
      kind,
      likes: updated.likes,
      dislikes: updated.dislikes,
    });
  } catch (error) {
    console.error('Rate voice error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'A server error occurred.' },
      { status: 500 }
    );
  }
}

/** GET — returns the current user's vote on this voice (or null). */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ voted: null });
    }
    const existing = await db.voiceRating.findUnique({
      where: { voiceId_userId: { voiceId: id, userId: session.user.id } },
      select: { kind: true },
    });
    return NextResponse.json({ voted: existing?.kind ?? null });
  } catch (error) {
    console.error('Get vote error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'A server error occurred.' },
      { status: 500 }
    );
  }
}
