import { analyzeLeadHandler, sendResponse } from '../server/backendLogic';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, { ok: true });
  }
  return analyzeLeadHandler(req, res);
}
