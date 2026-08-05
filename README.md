# CareerPilot AI — Real-Time AI Interview Preparation Coach

CareerPilot AI is a full-stack Generative AI application designed to help undergraduate students and entry-level developers prepare for technical interviews. It provides customized mock interviews, real-time feedback, detailed performance metrics, final reports, and custom 7-day study plans.

---

## Key Features

1. **Landing Page**: Product showcase and feature summary.
2. **Student Authentication**: Register, Login, and Logout using Supabase Auth.
3. **Onboarding & Profile Setup**: Tailor target role, experience level, known/weak tech stacks, and daily preparation goals.
4. **Interview Setup**: Customize interview type (*Technical*, *HR*, *Mixed*), target role, topic, difficulty (*Easy*, *Medium*, *Hard*), and question count (3, 5, 10).
5. **AI Question Generation**: Powered by Gemini API (`@google/genai`) with structured JSON prompts and server-side hidden expected points.
6. **Real-time Session Status**: Powered by Supabase Realtime (`waiting`, `generating_question`, `question_ready`, `evaluating_answer`, `generating_feedback`, `saving_result`, `completed`, `failed`).
7. **Answer Evaluation & Feedback**: Gemini evaluates answers based on technical correctness (40%), completeness (20%), clarity (15%), practical understanding (15%), and communication (10%).
8. **Final Interview Report**: Comprehensive performance evaluation with percentage score, strong/weak areas, revision topics, and next difficulty recommendation.
9. **7-Day AI Study Plan**: Customized plan focusing on student weak areas.
10. **Interview History & Progress**: Review past mock interviews and track topic-wise progress.

---

## Tech Stack

- **Frontend**: React.js, Vite, TypeScript, Tailwind CSS, Lucide React, React Hook Form, Zod, `@supabase/supabase-js`
- **Backend**: Node.js, Express.js, TypeScript, `@google/genai` (Google GenAI SDK), `@supabase/supabase-js`, Zod, Rate Limiter, Helmet
- **Database & Auth**: Supabase Auth, Supabase PostgreSQL, Row Level Security (RLS), Supabase Realtime

---

## Getting Started Locally

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. Open the **SQL Editor** in Supabase.
3. Run the SQL script from [`supabase/migrations/20260805_initial_schema.sql`](./supabase/migrations/20260805_initial_schema.sql).

### 2. Backend Setup (`server/`)
```bash
cd server
npm install
cp .env.example .env
```
Fill in `.env`:
- `PORT=5000`
- `SUPABASE_URL=your-supabase-url`
- `SUPABASE_ANON_KEY=your-supabase-anon-key`
- `SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key`
- `GEMINI_API_KEY=your-gemini-api-key`
- `CLIENT_URL=http://localhost:5173`

Run backend:
```bash
npm run dev
```

### 3. Frontend Setup (`client/`)
```bash
cd client
npm install
cp .env.example .env
```
Fill in `.env`:
- `VITE_SUPABASE_URL=your-supabase-url`
- `VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`
- `VITE_API_BASE_URL=http://localhost:5000`

Run frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Deployment

- **Backend**: Deploy `server/` to Render, Railway, or Vercel Serverless. Ensure environment variables are configured.
- **Frontend**: Deploy `client/` to Vercel, Netlify, or Cloudflare Pages.
- **Database**: Managed by Supabase with Row Level Security enabled.
