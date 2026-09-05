import { Request, Response } from 'express';
import { FraudNetworkService } from '../services/fraudNetwork.service.js';

export const getFraudNetwork = async (req: Request, res: Response) => {
  try {
    const entityId = req.params.entityId as string;
    const network = await FraudNetworkService.getNetworkForEntity(entityId);
    res.json(network);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate fraud network' });
  }
};
