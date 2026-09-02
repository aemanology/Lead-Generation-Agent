import { analyzeLeadHandler, sendResponse } from '../server/backendLogic';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'OPTIONS') {
      return sendResponse(res, 200, { ok: true });
    }
    return await analyzeLeadHandler(req, res);
  } catch (err: any) {
    console.error('Unhandled error in api/analyze-lead handler:', err);
    return sendResponse(res, 500, {
      error: err?.message || 'Internal server error during lead analysis.',
    });
  }
}
