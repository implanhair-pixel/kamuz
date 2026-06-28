import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { deleteVoiceRecording } from '@/lib/cloudinary';

/**
 * DELETE /api/user/voices/[id]
 * Allows a user to soft-delete their own voice recording.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Please sign in.' },
        { status: 401 }
      );
    }

    const voice = await db.voiceRecording.findUnique({ where: { id } });
    if (!voice) {
      return NextResponse.json(
        { error: 'not_found', message: 'Voice not found.' },
        { status: 404 }
      );
    }

    // Ownership check — only the user who uploaded the voice can delete it.
    if (voice.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'forbidden', message: 'You can only delete your own recordings.' },
        { status: 403 }
      );
    }

    // Soft-delete the recording (keep the row, mark as deleted).
    await db.voiceRecording.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Remove the audio asset from Cloudinary to free up storage.
    // We do this in a try/catch so a missing/already-deleted asset doesn't break the request.
    try {
      await deleteVoiceRecording(voice.fileName); // fileName holds the Cloudinary public_id
    } catch {
      // Asset already gone or id invalid — ignore.
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete voice error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'A server error occurred.' },
      { status: 500 }
    );
  }
}
