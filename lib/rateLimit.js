const rateLimitMap = new Map();

export function rateLimit({
  key,
  limit  = 10,
  window = 60 * 1000, // 1 minute
}) {
  const now    = Date.now();
  const record = rateLimitMap.get(key) ?? { count: 0, resetAt: now + window };

  // Reset window if expired
  if (now > record.resetAt) {
    record.count   = 0;
    record.resetAt = now + window;
  }

  record.count += 1;
  rateLimitMap.set(key, record);

  const remaining = Math.max(0, limit - record.count);
  const allowed   = record.count <= limit;

  return { allowed, remaining, resetAt: record.resetAt };
}