import { Request, Response } from 'express';
import { InvestigationService } from '../services/investigation.service.js';

export const investigateEntity = async (req: Request, res: Response) => {
  try {
    const { entityId, entityType } = req.body;
    
    if (!entityId || !entityType) {
      return res.status(400).json({ error: 'entityId and entityType are required' });
    }

    if (entityType !== 'transaction' && entityType !== 'customer') {
      return res.status(400).json({ error: 'entityType must be either transaction or customer' });
    }
    
    const result = await InvestigationService.investigateEntity(entityId, entityType);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to investigate entity' });
  }
};
