import { searchBusinessesHandler } from '../server/backendLogic.ts';

export default async function handler(req: any, res: any) {
  return searchBusinessesHandler(req, res);
}
