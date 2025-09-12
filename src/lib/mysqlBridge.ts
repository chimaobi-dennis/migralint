import { supabase } from "@/integrations/supabase/client";

export interface MysqlBridgeOptions {
  action: 'sync_to_supabase' | 'sync_to_mysql' | 'get_mysql_data' | 'update_mysql';
  table?: string;
  userId?: string;
  data?: any[];
  query?: string;
}

/**
 * Bridge utility to connect your existing MySQL database with Supabase for real-time capabilities
 * 
 * Usage examples:
 * 
 * // Sync data from MySQL to Supabase for real-time updates
 * await mysqlBridge({
 *   action: 'sync_to_supabase',
 *   table: 'user_data',
 *   userId: 'user123'
 * });
 * 
 * // Get data directly from MySQL
 * const result = await mysqlBridge({
 *   action: 'get_mysql_data',
 *   query: 'SELECT * FROM users WHERE id = ?',
 *   data: [userId]
 * });
 * 
 * // Update MySQL and automatically sync to Supabase
 * await mysqlBridge({
 *   action: 'update_mysql',
 *   table: 'user_data',
 *   userId: 'user123',
 *   query: 'UPDATE user_data SET status = ? WHERE user_id = ?',
 *   data: ['active', 'user123']
 * });
 */
export async function mysqlBridge(options: MysqlBridgeOptions) {
  try {
    const { data, error } = await supabase.functions.invoke('mysql-bridge', {
      body: options
    });

    if (error) {
      console.error('MySQL Bridge Error:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Failed to execute MySQL bridge operation:', err);
    throw err;
  }
}

/**
 * Helper to set up real-time subscriptions on Supabase tables
 * that are synced from your MySQL database
 */
export function subscribeToRealtimeData(
  table: string,
  userId: string,
  onUpdate: (payload: any) => void
) {
  const channel = supabase
    .channel(`${table}-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time update:', payload);
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Sync user data from MySQL to Supabase when user logs in
 * Call this from your Laravel app or frontend after authentication
 */
export async function syncUserDataOnLogin(userId: string, tables: string[]) {
  const syncPromises = tables.map(table => 
    mysqlBridge({
      action: 'sync_to_supabase',
      table,
      userId
    })
  );

  await Promise.all(syncPromises);
  console.log(`Synced user ${userId} data to Supabase for real-time updates`);
}