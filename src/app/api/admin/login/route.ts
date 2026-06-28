import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kurdamuz@admin2024';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'invalid_credentials', message: 'ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە!' },
        { status: 401 }
      );
    }

    // Generate a simple session token (valid for 24h)
    const token = Buffer.from(`${ADMIN_USERNAME}:${Date.now()}`).toString('base64url');

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'هەڵەیەکی سێرڤەر ڕوویدا.' },
      { status: 500 }
    );
  }
}

// Verify token (lightweight check)
export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [username, timestamp] = decoded.split(':');
    if (username !== ADMIN_USERNAME) return false;
    // Token valid for 24 hours
    const tokenAge = Date.now() - parseInt(timestamp);
    return tokenAge < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}