import { Request, Response } from 'express';
import { SimulationService } from '../services/simulation.service.js';

export const triggerFraudAttack = async (_req: Request, res: Response) => {
  try {
    const result = await SimulationService.triggerFraudAttack();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to trigger fraud attack simulation' });
  }
};

export const resetSimulation = async (_req: Request, res: Response) => {
  try {
    const result = await SimulationService.resetSimulation();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to reset simulation' });
  }
};
