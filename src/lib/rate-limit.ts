import crypto from 'crypto';

export function hashIP(request: Request): string {
  // Netlify passes the real IP via x-nf-client-connection-ip
  // Vercel uses x-forwarded-for — we check both for compatibility
  const netlifyIP = request.headers.get('x-nf-client-connection-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = netlifyIP || forwarded?.split(',')[0]?.trim() || 'unknown';
  return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'kurdamuz_salt')).digest('hex').slice(0, 16);
}

export async function checkRateLimit(ipHash: string, action: string, maxPerDay: number): Promise<boolean> {
  const { db } = await import('@/lib/db');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await db.rateLimit.findUnique({
    where: { ipHash_action: { ipHash, action } },
  });

  if (!record || record.resetAt < new Date()) {
    return true; // No record or expired
  }

  return record.count < maxPerDay;
}

export async function incrementRateLimit(ipHash: string, action: string): Promise<void> {
  const { db } = await import('@/lib/db');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  await db.rateLimit.upsert({
    where: { ipHash_action: { ipHash, action } },
    create: { ipHash, action, count: 1, resetAt: tomorrow },
    update: {
      count: { increment: 1 },
      resetAt: tomorrow,
    },
  });
}

export async function getRemainingLimit(ipHash: string, action: string, maxPerDay: number): Promise<number> {
  const { db } = await import('@/lib/db');
  const record = await db.rateLimit.findUnique({
    where: { ipHash_action: { ipHash, action } },
  });

  if (!record || record.resetAt < new Date()) {
    return maxPerDay;
  }

  return Math.max(0, maxPerDay - record.count);
}
