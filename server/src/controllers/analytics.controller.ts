import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

export const getAnalyticsOverview = async (_req: Request, res: Response) => {
  try {
    const overview = await AnalyticsService.getOverview();
    res.json(overview);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch analytics overview' });
  }
};
