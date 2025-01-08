import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { files } = await req.json()

    // Process each file from storage
    const processedData = await Promise.all(files.map(async (fileInfo: any) => {
      const { data: fileData } = await supabase.storage
        .from('consumption_files')
        .download(`simulations/${fileInfo.location}/${fileInfo.filename}`)

      if (!fileData) {
        throw new Error(`File not found: ${fileInfo.filename}`)
      }

      const text = await fileData.text()
      const rows = text.split('\n').map(row => row.split(','))
      
      // Basic CSV processing - you would expand this based on your needs
      const processedRows = rows.slice(1).map(row => ({
        timestamp: row[0],
        value: parseFloat(row[1])
      })).filter(row => !isNaN(row.value))

      return {
        location: fileInfo.location,
        data: processedRows
      }
    }))

    // Simulate battery storage
    const batteryCapacity = 1000 // MWh
    const batteryEfficiency = 0.9
    let batteryCharge = batteryCapacity * 0.5 // Start at 50%

    const simulationResults = processedData.map(locationData => {
      const hourlyData = locationData.data.map(row => {
        const production = row.value / 1000 // Convert Wh to MWh
        const consumption = Math.random() * production * 1.2 // Simulated consumption
        
        // Battery logic
        let netEnergy = production - consumption
        if (netEnergy > 0) {
          // Charge battery
          const chargeAmount = Math.min(netEnergy * batteryEfficiency, batteryCapacity - batteryCharge)
          batteryCharge += chargeAmount
          netEnergy -= chargeAmount / batteryEfficiency
        } else {
          // Discharge battery
          const dischargeNeeded = -netEnergy
          const dischargeAmount = Math.min(dischargeNeeded, batteryCharge)
          batteryCharge -= dischargeAmount
          netEnergy += dischargeAmount * batteryEfficiency
        }

        return {
          timestamp: row.timestamp,
          production,
          consumption,
          batteryCharge,
          netEnergy
        }
      })

      return {
        location: locationData.location,
        hourlyData
      }
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: simulationResults
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})