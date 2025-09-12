import { useEffect, useState } from 'react'
import { mysqlBridge, subscribeToRealtimeData, syncUserDataOnLogin } from '@/lib/mysqlBridge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface UserData {
  id: string
  user_id: string
  name: string
  status: string
  updated_at: string
}

/**
 * Example component showing how to use MySQL Bridge for real-time data
 * This connects your existing MySQL database with Supabase for real-time capabilities
 */
export function RealtimeDataExample() {
  const [userData, setUserData] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userId] = useState('user123') // Replace with actual user ID from your Laravel auth

  useEffect(() => {
    // Set up real-time subscription
    const unsubscribe = subscribeToRealtimeData(
      'user_data', // Your MySQL table name
      userId,
      (payload) => {
        // Handle real-time updates
        if (payload.eventType === 'INSERT') {
          setUserData(prev => [...prev, payload.new])
        } else if (payload.eventType === 'UPDATE') {
          setUserData(prev => 
            prev.map(item => 
              item.id === payload.new.id ? payload.new : item
            )
          )
        } else if (payload.eventType === 'DELETE') {
          setUserData(prev => 
            prev.filter(item => item.id !== payload.old.id)
          )
        }
      }
    )

    // Cleanup subscription on unmount
    return unsubscribe
  }, [userId])

  const handleSyncFromMySQL = async () => {
    setIsLoading(true)
    try {
      // Sync data from MySQL to Supabase for real-time capabilities
      await mysqlBridge({
        action: 'sync_to_supabase',
        table: 'user_data',
        userId: userId
      })
      
      // Get the synced data
      const result = await mysqlBridge({
        action: 'get_mysql_data',
        query: 'SELECT * FROM user_data WHERE user_id = ?',
        data: [userId]
      })
      
      setUserData(result.data || [])
    } catch (error) {
      console.error('Failed to sync data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      // Update in MySQL and automatically sync to Supabase for real-time
      await mysqlBridge({
        action: 'update_mysql',
        table: 'user_data',
        userId: userId,
        query: 'UPDATE user_data SET status = ?, updated_at = NOW() WHERE id = ?',
        data: [newStatus, id]
      })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleInitialSync = async () => {
    setIsLoading(true)
    try {
      // Sync multiple tables when user logs in
      await syncUserDataOnLogin(userId, ['user_data', 'user_preferences', 'user_settings'])
    } catch (error) {
      console.error('Failed to sync user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MySQL + Supabase Real-time Bridge</CardTitle>
          <CardDescription>
            This example shows how to connect your existing MySQL database with Supabase for real-time capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleSyncFromMySQL} 
              disabled={isLoading}
            >
              {isLoading ? 'Syncing...' : 'Sync from MySQL'}
            </Button>
            <Button 
              onClick={handleInitialSync} 
              variant="outline"
              disabled={isLoading}
            >
              Initial User Sync
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Real-time User Data:</h3>
            {userData.length === 0 ? (
              <p className="text-muted-foreground">No data synced yet. Click "Sync from MySQL" to load data.</p>
            ) : (
              userData.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Updated: {new Date(item.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(
                          item.id, 
                          item.status === 'active' ? 'inactive' : 'active'
                        )}
                      >
                        Toggle Status
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. <strong>Keep Laravel Auth:</strong> Your existing authentication stays unchanged</p>
          <p>2. <strong>MySQL Bridge:</strong> Edge Function connects to your MySQL database</p>
          <p>3. <strong>Real-time Sync:</strong> Data syncs to Supabase for real-time capabilities</p>
          <p>4. <strong>Live Updates:</strong> Changes in MySQL trigger real-time updates in your React app</p>
        </CardContent>
      </Card>
    </div>
  )
}