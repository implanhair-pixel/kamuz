import { NextResponse } from 'next/server';

/**
 * Public endpoint that tells the client whether Google OAuth credentials
 * are configured. The login page uses this to show/hide the
 * "Sign in with Google" button — without it, users would see a broken
 * OAuth flow when credentials are missing.
 */
export async function GET() {
  return NextResponse.json({
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    credentials: true, // email/password is always available
  });
}
