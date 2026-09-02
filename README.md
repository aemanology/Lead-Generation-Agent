# AI Lead Finder 🚀

AI Lead Finder is an intelligent SaaS platform that empowers freelancers, agencies, and sales professionals to instantly discover high-value local business prospects and generate personalized, high-converting cold outreach using OpenRouter AI.

---

## 🎯 Problem Solved

Freelancers and small agencies often spend **10+ hours per week** manually searching for potential clients on Google Maps, analyzing their websites for flaws, and drafting cold emails line-by-line.

**AI Lead Finder** automates this entire pipeline into 3 simple steps:
1. **Target Search:** Search any business niche in any location (e.g. Restaurants in New York, Dental Clinics in Austin).
2. **Instant AI Audit:** AI analyzes each business's online presence, calculates an Opportunity Score (1-10), identifies specific pain points, and suggests the ideal service to pitch.
3. **Personalized Cold Outreach:** Automatically generates persuasive cold emails under 120 words with professional subject lines, ready to copy and send in 1 click.

---

## ✨ Features

- **Google Sign-In & Auth:** Authenticate via Firebase Google Auth or run seamlessly in local session mode.
- **Precision Lead Discovery:** Search businesses by Business Type, City/Location, Freelancer Service, and Lead Count.
- **OpenRouter AI Analysis:** Evaluates lead opportunity scores, why the business is a good fit, potential problems, and service recommendations.
- **1-Click Cold Email Generator:** Customized email subject lines and concise cold emails (<120 words) matching the prospect's pain points.
- **Copy to Clipboard:** 1-Click copy subject line and email body with instant toast feedback.
- **Saved Leads Library:** Save leads directly to Firebase Firestore with searching, category filtering, and 1-click **CSV Export**.
- **Search History Log:** Automatically logs past search parameters and lead counts with a 1-click **Re-run Search** button.
- **Responsive SaaS Dashboard:** Designed with Tailwind CSS, rounded cards, blue and purple gradient accents, mobile navigation drawer, and **Dark/Light Mode** toggle.

---

## 🤖 AI Functionality

The platform leverages **OpenRouter API** via a secure, server-side Express proxy.

**System Prompt Architecture:**
```json
{
  "opportunityScore": 8,
  "whyGoodLead": "Explanation of market potential and digital gaps",
  "possibleProblems": ["Outdated mobile experience", "Missing local SEO funnels"],
  "recommendedService": "Custom Web Redesign & Local SEO Package",
  "coldEmail": "Personalized cold outreach under 120 words...",
  "emailSubject": "Quick idea regarding [Business Name]'s growth"
}
```

---

## 🛠️ Technologies Used

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons, Motion
- **Backend:** Node.js, Express, `esbuild`, `tsx`
- **AI Integration:** OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`)
- **Database & Auth:** Firebase Authentication, Firebase Firestore (with local sync fallback)
- **Deployment:** Vercel / Cloud Run / Node CJS single-bundle

---

## 🚀 Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-lead-finder.git
cd ai-lead-finder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Required for OpenRouter AI API
OPENROUTER_API_KEY="YOUR_OPENROUTER_API_KEY"
OPENROUTER_MODEL="openai/gpt-4o-mini"

# Optional: SERP API Key
SERP_API_KEY="YOUR_SERP_API_KEY"

# Optional: Firebase Web Credentials
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📦 Vercel Deployment Instructions

To deploy **AI Lead Finder** to **Vercel**:

1. **Push your code** to GitHub or GitLab.
2. **Import Project into Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/) -> **Add New Project** -> Select your repo.
3. **Configure Build Settings:**
   - Framework Preset: **Vite** or **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables in Vercel:**
   Add the following in Vercel Project Settings -> Environment Variables:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL` (Optional)
   - `SERP_API_KEY` (Optional)
   - `VITE_FIREBASE_API_KEY` (Optional)
   - `VITE_FIREBASE_PROJECT_ID` (Optional)
5. **Serverless API Routes:**
   For Vercel serverless functions, Vercel automatically exposes API routes under `/api`. Click **Deploy**!
   For Vercel serverless functions, Vercel automatically exposes API routes under `/api`. Click **Deploy**!

---

## 📸 Screenshots

| Dashboard Search & AI Analysis | Saved Leads Library |
| :---: | :---: |
| ![Dashboard Screenshot](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80) | ![Saved Leads Screenshot](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80) |

---

## 📄 License

This project is licensed under the **Apache-2.0 License**. See the `LICENSE` file for details.
