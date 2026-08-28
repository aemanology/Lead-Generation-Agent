import { analyzeLeadHandler } from '../server/backendLogic.ts';

export default async function handler(req: any, res: any) {
  return analyzeLeadHandler(req, res);
}
