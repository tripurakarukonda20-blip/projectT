import { supabaseAdmin } from './supabase.js';
import { Transaction } from '../types/riskguard.js';

export class TransactionService {
  static async getTransactions(options: { riskLevel?: string; status?: string; limit?: number; offset?: number; search?: string }) {
    let query = supabaseAdmin.from('transactions').select('*', { count: 'exact' });

    if (options.riskLevel && options.riskLevel !== 'ALL') {
      query = query.eq('risk_level', options.riskLevel);
    }
    
    if (options.status) {
      query = query.eq('status', options.status);
    }
    
    // Simplistic search for demo purposes (searches ID or merchant)
    if (options.search) {
      query = query.or(`id.eq.${options.search},merchant_id.ilike.%${options.search}%`);
    }

    const limit = options.limit || 50;
    const offset = options.offset || 0;
    
    query = query.order('timestamp', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return { data, count };
  }

  static async getTransactionById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        *,
        customers (*),
        devices (*),
        ip_addresses (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
