# RiskGuard AI

RiskGuard AI is a high-performance financial risk management platform designed for online merchants. 

Merchants frequently face challenges with fraudulent transactions, account abuse, and coordinated fraud rings. RiskGuard AI provides a centralized dashboard to detect suspicious transactions in real-time, investigate high-risk entities with AI-assisted analysis, and uncover complex fraud networks before they cause significant financial loss.

## Core Features

- **Transaction Risk Scoring:** Deterministic rule-based engines combined with behavioral analysis to calculate transparent risk scores for incoming transactions.
- **Fraud Detection & Alerts:** Real-time generation of alerts when critical thresholds or anomalous patterns are detected.
- **AI-Assisted Investigation:** Generates comprehensive, natural-language investigation summaries using Gemini AI, explaining exactly *why* a customer or transaction is considered risky based on observed evidence.
- **Fraud Network Visualization:** Interactive charting that reveals hidden relationships between suspicious accounts, shared devices, overlapping payment methods, and linked locations.
- **Fraud Attack Simulation:** A built-in testing utility that injects simulated, coordinated burst attacks (e.g., synthetic account creation and rapid high-value transactions) to demonstrate the platform's detection capabilities in a live environment.
- **Analytics Dashboard:** High-level metrics giving merchants a clear overview of their current risk exposure and recent fraud trends.

## Architecture

RiskGuard AI follows a modern, full-stack architecture:

- **Frontend:** React + Vite, styled with Tailwind CSS for a dark, professional, high-density fintech aesthetic.
- **Backend:** Node.js + Express API server handling business logic, risk calculation, and simulation engines.
- **Database:** Supabase (PostgreSQL) for reliable persistence of transactions, alerts, and entities.
- **AI Integration:** Google Gemini AI API, used by the investigation service to synthesize raw risk factors and transaction histories into actionable, human-readable investigation reports.

## API Structure

The backend exposes a clean RESTful API:

- `GET /api/transactions` & `GET /api/transactions/:id` - Transaction history and details.
- `POST /api/transactions/risk` - Evaluate a new transaction for risk.
- `GET /api/alerts` & `PATCH /api/alerts/:id` - Fetch and manage active security alerts.
- `GET /api/fraud-network/:entityId` - Retrieve relationship graphs for network visualization.
- `GET /api/analytics/overview` - Fetch high-level risk and transaction metrics.
- `POST /api/investigation` - Trigger a deep-dive Gemini AI investigation on a specific entity.
- `POST /api/simulation/fraud-attack` - Inject a synthetic fraud burst for demonstration.
- `POST /api/simulation/reset` - Clear the simulation state.

## Local Setup

### Prerequisites
- Node.js (v18+)
- A Supabase project (for PostgreSQL)
- A Google Gemini API Key

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment Configuration:**
   - In the `server` directory, copy `.env.example` to `.env` and fill in your Supabase connection strings and Gemini API key.
   - In the `client` directory, copy `.env.example` to `.env` and provide any necessary frontend variables (e.g., API URL).

3. **Database Migration:**
   - Execute the SQL schema located in `supabase/migrations/20260904162000_riskguard_schema.sql` within your Supabase project's SQL editor.

### Running the Application

Start the backend API server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```
The application will typically be accessible at `http://localhost:5173`.

## Demo Workflow

To demonstrate the platform's capabilities:
1. Open the **Dashboard**. It will initially show a healthy, low-risk state.
2. Navigate to the **Fraud Simulation** panel (or use the API) and trigger a "Simulate Fraud Attack".
3. Watch the dashboard instantly update: new high-risk transactions will appear, and critical alerts will populate the alert feed.
4. Click on one of the newly generated alerts to open the **Investigator Page**.
5. View the AI-generated investigation report (powered by Gemini) that clearly explains the synthetic attacker's behavior.
6. Check the **Fraud Network** page to visually see how the simulated attacker shares payment methods and IPs with other suspicious nodes.

## What broke and how we got out

This repository originally began as "CareerPilot AI," an interview-preparation prototype. During a rapid pivot for this hackathon, we transformed the entire codebase into **RiskGuard AI**, a merchant risk platform.

**Challenges we faced:**
- **Frontend vs. Backend Desync:** In our rush to build a visually impressive demo, we mistakenly built a completely client-side, hardcoded mock frontend that bypassed our newly developed Stage 2 backend (Express/Supabase).
- **The Fix:** We caught the architectural drift before committing. We carefully reverted the rogue mock frontend implementation using precise `git restore` commands while preserving the validated Stage 2 backend endpoints. We then successfully integrated the real Express API with the frontend, ensuring that our "Simulate Fraud Attack" and "AI Investigation" features actually process data through the backend and Gemini API rather than relying on browser-side illusions.
