import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TestSupabase() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[] | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('=== Testing Supabase Connection ===')
        console.log('Supabase instance:', supabase)
        
        const { data, error } = await supabase
          .from('asset_types')
          .select('*')
          .limit(1)

        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          setError(error.message)
        } else {
          console.log('Supabase query successful')
          console.log('Returned data:', data)
          setData(data)
        }
      } catch (err) {
        console.error('Connection error details:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Supabase Test</h1>
      
      {loading && <div className="text-blue-500">Loading...</div>}
      
      {error && (
        <div className="text-red-500">
          <h2 className="font-bold">Error:</h2>
          <pre className="mt-2 p-2 bg-red-50 rounded">{error}</pre>
        </div>
      )}
      
      {data && (
        <div className="mt-4">
          <h2 className="font-bold">Data:</h2>
          <pre className="mt-2 p-2 bg-gray-50 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 