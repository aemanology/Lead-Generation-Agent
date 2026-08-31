import { analyzeLeadHandler } from '../server/backendLogic';

export default async function handler(req: any, res: any) {
  try {
    console.log('ANALYZE FUNCTION STARTED');
    console.log('METHOD:', req.method);
    console.log('GEMINI KEY EXISTS:', !!process.env.GEMINI_API_KEY);

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ ok: true });
    }

    return await analyzeLeadHandler(req, res);
  } catch (error: any) {
    console.error('ANALYZE FUNCTION CRASH:', error);

    return res.status(500).json({
      error: 'Analyze function crashed',
      message: error?.message || String(error),
      stack: error?.stack || 'No stack available'
    });
  }
}