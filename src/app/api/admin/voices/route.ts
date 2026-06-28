import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminToken } from '../login/route';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const showDeleted = searchParams.get('deleted') === 'true';

    const where: Record<string, unknown> = {};
    if (!showDeleted) where.isDeleted = false;

    const [voices, total] = await Promise.all([
      db.voiceRecording.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          ratings: {
            select: { kind: true, ipHash: true, userId: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      }),
      db.voiceRecording.count({ where }),
    ]);

    return NextResponse.json({
      voices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin voices list error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}