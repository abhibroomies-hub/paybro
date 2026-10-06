import { activeSessions } from './create-checkout-session';

export default async function handler(req: any, res: any) {
  const sessionId = (req.query.id as string) || (req.query.sessionId as string);

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session id parameter' });
  }

  const session = activeSessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Checkout session not found or expired' });
  }

  // 1-hour TTL check
  const createdAt = new Date(session.createdAt).getTime();
  if (Date.now() - createdAt > 3600000) {
    delete activeSessions[sessionId];
    return res.status(410).json({ error: 'Checkout session expired (1-hour TTL)' });
  }

  return res.status(200).json({ success: true, session });
}
