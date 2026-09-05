import { supabaseAdmin } from './supabase.js';
import { FraudNetwork, FraudNetworkNode, FraudNetworkEdge } from '../types/riskguard.js';

export class FraudNetworkService {
  static async getNetworkForEntity(entityId: string): Promise<FraudNetwork> {
    // For a hackathon prototype, we will construct a mock/derived network
    // centered around the entityId (which could be a transaction ID or customer ID).
    // In a production environment, this would use a graph database or recursive SQL.
    
    const nodes: FraudNetworkNode[] = [];
    const links: FraudNetworkEdge[] = [];

    // Let's assume entityId is a customer ID for simplicity, or we fetch a transaction and get its customer
    let customerId = entityId;
    
    // Check if it's a transaction ID
    const { data: txData } = await supabaseAdmin.from('transactions').select('customer_id, device_id, ip_address').eq('id', entityId).single();
    if (txData && txData.customer_id) {
        customerId = txData.customer_id;
    }

    // 1. Fetch Customer
    const { data: customer } = await supabaseAdmin.from('customers').select('*').eq('id', customerId).single();
    if (customer) {
      nodes.push({ id: customer.id, type: 'CUSTOMER', label: customer.name || 'Unknown Customer', risk: customer.fraud_flags > 0 ? 'HIGH' : 'LOW' });
    } else {
        // Fallback if not found
        return { nodes: [], links: [], summary: { totalEntities: 0, suspiciousEntities: 0, potentialExposure: 0, riskLevel: 'LOW' } };
    }

    // 2. Fetch Customer's Transactions
    const { data: transactions } = await supabaseAdmin.from('transactions').select('*').eq('customer_id', customerId).limit(10);
    
    const devices = new Set<string>();
    const ips = new Set<string>();
    let suspiciousCount = 0;
    let exposure = 0;

    if (transactions) {
      transactions.forEach(tx => {
        if (tx.risk_level === 'HIGH') {
            suspiciousCount++;
            exposure += Number(tx.amount);
        }
        if (tx.device_id && !devices.has(tx.device_id)) {
            devices.add(tx.device_id);
            nodes.push({ id: tx.device_id, type: 'DEVICE', label: `Device ${tx.device_id.substring(0, 8)}`, risk: tx.device_shared > 2 ? 'HIGH' : 'LOW' });
            links.push({ source: customer.id, target: tx.device_id, type: 'SHARES_DEVICE' });
        }
        if (tx.ip_address && !ips.has(tx.ip_address)) {
            ips.add(tx.ip_address);
            nodes.push({ id: tx.ip_address, type: 'IP', label: tx.ip_address, risk: tx.ip_risk > 50 ? 'HIGH' : 'LOW' });
            links.push({ source: customer.id, target: tx.ip_address, type: 'SHARES_IP' });
        }
      });
    }

    return {
      nodes,
      links,
      summary: {
        totalEntities: nodes.length,
        suspiciousEntities: suspiciousCount,
        potentialExposure: exposure,
        riskLevel: suspiciousCount > 0 ? 'HIGH' : 'LOW'
      }
    };
  }
}
