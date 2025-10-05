import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid token');
    }

    console.log('Authenticated user:', user.id);

    // Create MySQL connection
    const mysqlClient = await new Client().connect({
      hostname: Deno.env.get('MYSQL_HOST') ?? '',
      username: Deno.env.get('MYSQL_USERNAME') ?? '',
      password: Deno.env.get('MYSQL_PASSWORD') ?? '',
      db: Deno.env.get('MYSQL_DATABASE') ?? '',
      port: parseInt(Deno.env.get('MYSQL_PORT') ?? '3306'),
    })

    console.log('Connected to MySQL database')

    const { action, table, data, userId, query } = await req.json();

    // Ensure userId matches authenticated user for security
    if (userId && userId !== user.id) {
      throw new Error('Unauthorized: Cannot access other user data');
    }

    switch (action) {
      case 'sync_to_supabase':
        // Sync data from MySQL to Supabase for real-time capabilities
        const mysqlData = await mysqlClient.execute(
          `SELECT * FROM ${table} WHERE user_id = ?`,
          [userId]
        )
        
        // Insert/update in Supabase for real-time
        const { error: supabaseError } = await supabaseClient
          .from(table)
          .upsert(mysqlData.rows)

        if (supabaseError) {
          console.error('Supabase sync error:', supabaseError)
          throw supabaseError
        }

        console.log(`Synced ${mysqlData.rows?.length} rows to Supabase`)
        break

      case 'sync_to_mysql':
        // Sync data from Supabase back to MySQL
        const { data: supabaseData, error } = await supabaseClient
          .from(table)
          .select('*')
          .eq('user_id', userId)

        if (error) {
          console.error('Supabase fetch error:', error)
          throw error
        }

        // Update MySQL with the data
        for (const row of supabaseData || []) {
          await mysqlClient.execute(
            `INSERT INTO ${table} (${Object.keys(row).join(', ')}) VALUES (${Object.keys(row).map(() => '?').join(', ')}) 
             ON DUPLICATE KEY UPDATE ${Object.keys(row).filter(key => key !== 'id').map(key => `${key} = VALUES(${key})`).join(', ')}`,
            Object.values(row)
          )
        }

        console.log(`Synced ${supabaseData?.length} rows to MySQL`)
        break

      case 'get_mysql_data':
        // Get data directly from MySQL
        const result = await mysqlClient.execute(query, data || [])
        
        return new Response(
          JSON.stringify({ success: true, data: result.rows }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update_mysql':
        // Update MySQL and sync to Supabase
        await mysqlClient.execute(query, data || [])
        
        // Trigger sync to Supabase for real-time updates
        const updatedData = await mysqlClient.execute(
          `SELECT * FROM ${table} WHERE user_id = ?`,
          [userId]
        )
        
        await supabaseClient
          .from(table)
          .upsert(updatedData.rows)

        console.log('Updated MySQL and synced to Supabase')
        break

      default:
        throw new Error('Invalid action')
    }

    await mysqlClient.close()

    return new Response(
      JSON.stringify({ success: true, message: `${action} completed successfully` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in mysql-bridge:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})