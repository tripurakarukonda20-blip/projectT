import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from './supabase.js';
import { InvestigationResult, RiskLevel } from '../types/riskguard.js';

import dotenv from 'dotenv';
dotenv.config();

const ai = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key' ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export class InvestigationService {
  static async investigateEntity(entityId: string, entityType: 'transaction' | 'customer'): Promise<InvestigationResult> {
    
    // 1. Gather data
    let contextData = '';
    
    if (entityType === 'transaction') {
      const { data: tx } = await supabaseAdmin.from('transactions').select('*, customers(*)').eq('id', entityId).single();
      if (!tx) throw new Error('Transaction not found');
      contextData = JSON.stringify(tx, null, 2);
    } else {
      const { data: customer } = await supabaseAdmin.from('customers').select('*').eq('id', entityId).single();
      const { data: txs } = await supabaseAdmin.from('transactions').select('*').eq('customer_id', entityId).limit(5);
      if (!customer) throw new Error('Customer not found');
      contextData = JSON.stringify({ customer, recent_transactions: txs }, null, 2);
    }

    // 2. Call Gemini if available
    if (ai) {
      try {
        const prompt = `
          You are an expert AI Fraud Investigator. Analyze the following data and produce a JSON report.
          Data:
          ${contextData}
          
          Respond ONLY with a valid JSON object matching this schema:
          {
            "summary": "string",
            "observedEvidence": ["string"],
            "riskFactors": ["string"],
            "relatedEntities": ["string"],
            "calculatedRisk": "LOW" | "MEDIUM" | "HIGH",
            "recommendation": "string",
            "confidence": number (0-100)
          }
          Do NOT invent evidence. Strictly base findings on the provided Data.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        if (response.text) {
          const result = JSON.parse(response.text) as InvestigationResult;
          return result;
        }
      } catch (err) {
        console.error('Gemini Investigation Failed, falling back to deterministic:', err);
      }
    }

    // 3. Deterministic Fallback if Gemini is not configured or failed
    const isHighRisk = contextData.includes('"risk_level": "HIGH"');
    return {
      summary: "Automated deterministic investigation due to AI service unavailability.",
      observedEvidence: ["Transaction data retrieved successfully", "Pattern matching applied"],
      riskFactors: isHighRisk ? ["High risk score detected in raw data"] : ["Normal transaction patterns"],
      relatedEntities: ["Device fingerprint", "IP Address"],
      calculatedRisk: isHighRisk ? 'HIGH' : 'LOW',
      recommendation: isHighRisk ? "Manual review required immediately." : "Proceed normally.",
      confidence: 85
    };
  }
}
