import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service.js';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const { status, limit } = req.query;
    
    const alerts = await AlertService.getAlerts({
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch alerts' });
  }
};

export const getAlertById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const alert = await AlertService.getAlertById(id);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch alert' });
  }
};

export const updateAlertStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const updatedAlert = await AlertService.updateAlertStatus(id, status);
    res.json(updatedAlert);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update alert status' });
  }
};
