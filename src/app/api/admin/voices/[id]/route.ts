import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminToken } from '../../login/route';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const voice = await db.voiceRecording.findUnique({ where: { id } });
    if (!voice) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // Soft delete
    await db.voiceRecording.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Log admin action
    await db.adminLog.create({
      data: {
        action: 'delete_voice',
        targetId: id,
        detail: `Deleted voice: "${voice.title}" by ${voice.nickname}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete voice error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const voice = await db.voiceRecording.findUnique({ where: { id } });
    if (!voice) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (typeof body.isDeleted === 'boolean') updateData.isDeleted = body.isDeleted;
    if (typeof body.title === 'string') updateData.title = body.title;
    if (typeof body.nickname === 'string') updateData.nickname = body.nickname;

    const updated = await db.voiceRecording.update({
      where: { id },
      data: updateData,
    });

    await db.adminLog.create({
      data: {
        action: 'update_voice',
        targetId: id,
        detail: `Updated voice: "${voice.title}"`,
      },
    });

    return NextResponse.json({ success: true, voice: updated });
  } catch (error) {
    console.error('Admin update voice error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}