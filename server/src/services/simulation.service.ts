import { supabaseAdmin } from './supabase.js';
import { SimulationResult } from '../types/riskguard.js';

export class SimulationService {
  static async triggerFraudAttack(): Promise<SimulationResult> {
    
    // 1. Create a fake customer
    const { data: customer } = await supabaseAdmin.from('customers').insert({
      name: 'Synthetic Attacker',
      email: 'hacker@synthetic.local',
      fraud_flags: 5
    }).select().single();

    if (!customer) throw new Error('Failed to create synthetic customer');

    // 2. Generate 3 high-risk transactions from the same "new" device & IP
    const deviceId = 'sim-device-999';
    const ipAddress = '192.168.1.99';

    await supabaseAdmin.from('devices').upsert({ id: deviceId, risk_score: 95 });
    await supabaseAdmin.from('ip_addresses').upsert({ id: ipAddress, country: 'Unknown', risk_score: 90 });

    const transactionsToInsert = [
      {
        customer_id: customer.id,
        amount: 85000,
        merchant_id: 'Jewelry Store X',
        device_id: deviceId,
        ip_address: ipAddress,
        is_new_device: true,
        velocity_24h: 1,
        ip_risk: 90,
        risk_score: 95,
        risk_level: 'HIGH',
        status: 'PENDING'
      },
      {
        customer_id: customer.id,
        amount: 45000,
        merchant_id: 'Electronics Store Y',
        device_id: deviceId,
        ip_address: ipAddress,
        is_new_device: true,
        velocity_24h: 2,
        ip_risk: 90,
        risk_score: 98,
        risk_level: 'HIGH',
        status: 'PENDING'
      }
    ];

    const { data: txs } = await supabaseAdmin.from('transactions').insert(transactionsToInsert).select();

    // 3. Generate an alert
    if (txs && txs.length > 0) {
      await supabaseAdmin.from('alerts').insert({
        type: 'VELOCITY_SPIKE',
        severity: 'CRITICAL',
        description: 'Multiple high-value transactions detected from a new, high-risk device within minutes.',
        affected_entity_id: customer.id,
        entity_type: 'CUSTOMER',
        recommended_action: 'Block customer account and reverse pending transactions.'
      });
    }

    return {
      message: 'Fraud attack simulation triggered successfully',
      generatedTransactions: transactionsToInsert.length,
      generatedAlerts: 1,
      attackType: 'VELOCITY_SPIKE_NEW_DEVICE'
    };
  }

  static async resetSimulation(): Promise<{ message: string }> {
    // Delete all synthetic data (cascade deletes should handle transactions/alerts if set up correctly, 
    // but we can just delete from customers where email = hacker@synthetic.local)
    await supabaseAdmin.from('customers').delete().eq('email', 'hacker@synthetic.local');
    await supabaseAdmin.from('devices').delete().eq('id', 'sim-device-999');
    await supabaseAdmin.from('ip_addresses').delete().eq('id', '192.168.1.99');
    
    return { message: 'Simulation data reset successfully' };
  }
}
