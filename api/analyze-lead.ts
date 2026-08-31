import { analyzeLeadHandler } from '../server/backendLogic';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'OPTIONS') {
      res.status(200).json({ ok: true });
      return;
    }

    await analyzeLeadHandler(req, res);
  } catch (error: any) {
    console.error('ANALYZE LEAD CRASH:', error);

    res.status(500).json({
      error: error?.message || 'Analyze lead function crashed',
    });
  }
}