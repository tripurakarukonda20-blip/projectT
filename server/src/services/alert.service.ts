import { supabaseAdmin } from './supabase.js';

export class AlertService {
  static async getAlerts(options: { status?: string; limit?: number }) {
    let query = supabaseAdmin.from('alerts').select('*');

    if (options.status && options.status !== 'ALL') {
      query = query.eq('status', options.status);
    }
    
    query = query.order('timestamp', { ascending: false }).limit(options.limit || 50);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data;
  }

  static async getAlertById(id: string) {
    const { data, error } = await supabaseAdmin.from('alerts').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  }

  static async updateAlertStatus(id: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from('alerts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }
}
