import { searchBusinessesHandler, sendResponse } from '../server/backendLogic.js';
export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, { ok: true });
  }
  return searchBusinessesHandler(req, res);
}
