import { healthHandler, sendResponse } from '../server/backendLogic';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'OPTIONS') {
      return sendResponse(res, 200, { ok: true });
    }
    return await healthHandler(req, res);
  } catch (err: any) {
    console.error('Unhandled error in api/health handler:', err);
    return sendResponse(res, 500, {
      status: 'error',
      error: err?.message || 'Health check failed.',
    });
  }
}
