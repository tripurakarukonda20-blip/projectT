import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service.js';
import { RiskService, RiskInputData } from '../services/risk.service.js';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { riskLevel, status, limit, offset, search } = req.query;
    
    const result = await TransactionService.getTransactions({
      riskLevel: riskLevel as string,
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      search: search as string,
    });
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch transactions' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const transaction = await TransactionService.getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch transaction' });
  }
};

// Example endpoint for processing a new transaction through the risk engine
export const processTransactionRisk = async (req: Request, res: Response) => {
  try {
    const data: RiskInputData = req.body;
    
    // In a real app, validate data with Zod here
    if (data.amount === undefined) {
       return res.status(400).json({ error: 'Amount is required' });
    }

    const assessment = RiskService.evaluateTransactionRisk(data);
    res.json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to process risk' });
  }
};
