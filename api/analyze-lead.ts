import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is missing in Vercel'
      });
    }

    const { business, freelancerService = 'Web Development' } = req.body || {};

    if (!business) {
      return res.status(400).json({
        error: 'Business data is missing'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash'
    });

    const prompt = `
Analyze this business lead for a freelancer.

Business:
${JSON.stringify(business, null, 2)}

Freelancer service:
${freelancerService}

Return ONLY valid JSON in this exact structure:

{
  "opportunityScore": 1,
  "leadClassification": "Strong Opportunity",
  "identifiedProblems": [],
  "whyOpportunity": "",
  "recommendedService": "",
  "recommendedOffer": "",
  "coldEmail": "",
  "emailSubject": ""
}

Use only the information provided. Do not invent facts.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      analysis = {
        opportunityScore: 8,
        leadClassification: business.preQualification || 'Possible Opportunity',
        identifiedProblems: ['AI returned an invalid JSON response'],
        whyOpportunity: text,
        recommendedService: freelancerService,
        recommendedOffer: `Custom ${freelancerService} package`,
        coldEmail: '',
        emailSubject: 'Quick idea for your business'
      };
    }

    return res.status(200).json({ analysis });

  } catch (error: any) {
    console.error('GEMINI ERROR:', error);

    return res.status(500).json({
      error: 'Gemini analysis failed',
      message: error?.message || String(error)
    });
  }
}