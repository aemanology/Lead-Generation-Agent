export default async function handler(req: any, res: any) {
  return res.status(200).json({
    success: true,
    message: "Vercel analyze-lead function is working",
    geminiKeyExists: !!process.env.GEMINI_API_KEY
  });
}