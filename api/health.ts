import { healthHandler } from '../server/backendLogic.ts';

export default async function handler(req: any, res: any) {
  return healthHandler(req, res);
}
