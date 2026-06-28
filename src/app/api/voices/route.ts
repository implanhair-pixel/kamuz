import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { hashIP, checkRateLimit, incrementRateLimit } from '@/lib/rate-limit';
import { uploadVoiceRecording } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const ipHash = hashIP(request);

    // Voice upload requires authentication.
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Please sign in to upload a voice recording.' },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // Rate limit: max 5 uploads per day per IP
    const canUpload = await checkRateLimit(ipHash, 'voice_upload', 5);
    if (!canUpload) {
      return NextResponse.json(
        { error: 'voice_rate_limit', message: 'شوێنپێکردنی زۆر! تکایە دواتر هەوڵبدەرەوە.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('audio') as File | null;
    const title = (formData.get('title') as string)?.trim();
    const description = (formData.get('description') as string)?.trim() || null;
    const dialect = (formData.get('dialect') as string)?.trim() || 'sorani';
    // Don't default the nickname here — we want it to fall back to the
    // authenticated user's name when blank, not to a localized "Anonymous".
    const nickname = (formData.get('nickname') as string)?.trim() ?? '';
    const duration = parseFloat(formData.get('duration') as string) || 0;
    const vocabId = (formData.get('vocabId') as string)?.trim() || '';

    if (!file) {
      return NextResponse.json(
        { error: 'no_file', message: 'فایلی دەنگی نەنێردرا.' },
        { status: 400 }
      );
    }

    if (!vocabId) {
      return NextResponse.json(
        { error: 'no_vocab', message: 'Please select a vocabulary word first.' },
        { status: 400 }
      );
    }

    if (!title || title.length < 2) {
      return NextResponse.json(
        { error: 'no_title', message: 'تکایە ناونیشانێک بنووسە.' },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: 'title_too_long', message: 'ناونیشان زۆر درێژە. (بەرزترین: ١٠٠ پیت)' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/webm', 'audio/ogg', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/mp4', 'audio/m4a', 'audio/x-m4a'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(webm|ogg|mp3|wav|m4a)$/i)) {
      return NextResponse.json(
        { error: 'invalid_type', message: 'جۆری فایل نادروستە. تەنها فایلی دەنگی ڕێگەپێدراوە.' },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'file_too_large', message: 'قەبارەی فایل زۆر گەورەیە. (بەرزترین: ١٠ مێگابایت)' },
        { status: 400 }
      );
    }

    if (duration > 120) {
      return NextResponse.json(
        { error: 'too_long', message: 'درێژایی دەنگ زۆرە. (بەرزترین: ٢ خولەک)' },
        { status: 400 }
      );
    }

    const validDialects = ['sorani', 'kalhori', 'kurmanji'];
    if (!validDialects.includes(dialect)) {
      return NextResponse.json(
        { error: 'invalid_dialect', message: 'زاراوەی نادروست.' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary (no local disk involved — works on serverless hosts like Vercel)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || 'webm';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { url: uploadedUrl, publicId } = await uploadVoiceRecording(buffer, fileName);

    // Save to DB — link to the authenticated user.
    // If the user provided a nickname, use it; otherwise fall back to their account name.
    const finalNickname = (nickname && nickname.trim().length > 0)
      ? nickname.trim().slice(0, 50)
      : (session.user.name?.slice(0, 50) || 'Anonymous');

    const recording = await db.voiceRecording.create({
      data: {
        title,
        description,
        dialect,
        fileName: publicId, // Cloudinary public_id, used later to delete the asset
        filePath: uploadedUrl, // full Cloudinary URL, used directly as <audio src>
        duration,
        ipHash,
        nickname: finalNickname,
        vocabId,
        userId,
      },
    });

    await incrementRateLimit(ipHash, 'voice_upload');

    return NextResponse.json({ success: true, recording });
  } catch (error) {
    console.error('Voice upload error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'هەڵەیەکی سێرڤەر ڕوویدا.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const dialect = searchParams.get('dialect') || '';
    const sort = searchParams.get('sort') || 'newest';

    const where: Record<string, unknown> = { isDeleted: false };
    if (dialect && ['sorani', 'kalhori', 'kurmanji'].includes(dialect)) {
      where.dialect = dialect;
    }

    // "top" now means most-liked (likes - dislikes, then likes as tiebreaker).
    const orderBy: Record<string, string> =
      sort === 'top' ? { likes: 'desc' } : { createdAt: 'desc' };

    const [voices, total] = await Promise.all([
      db.voiceRecording.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      db.voiceRecording.count({ where }),
    ]);

    return NextResponse.json({
      voices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Voices list error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'هەڵەیەکی سێرڤەر ڕوویدا.' },
      { status: 500 }
    );
  }
}