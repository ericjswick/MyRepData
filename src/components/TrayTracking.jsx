import { useState, useEffect } from 'react'
import { Package, RefreshCw, MapPin, Clock, Building2, CheckCircle, AlertCircle, Settings, ArrowLeftRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import TrayTrackerConfig from './TrayTrackerConfig'

const TrayTracking = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFacility, setSelectedFacility] = useState('')
  const [trays, setTrays] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)

  useEffect(() => {
    fetchFacilities()
    checkConnectionStatus()
  }, [])

  useEffect(() => {
    if (selectedFacility) {
      fetchTrayStatus(selectedFacility)
    }
  }, [selectedFacility])

  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/facilities?per_page=100')
      const data = await response.json()
      setFacilities(data.facilities || [])
      if (data.facilities && data.facilities.length > 0) {
        setSelectedFacility(data.facilities[0].id.toString())
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
      // Mock data
      setFacilities([
        { id: 1, account_name: 'Advanced Spine Center' },
        { id: 2, account_name: 'Access Medical Center' }
      ])
      setSelectedFacility('1')
    }
  }

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/trays/connection/test')
      const data = await response.json()
      setConnectionStatus(data)
    } catch (error) {
      console.error('Error checking connection:', error)
      setConnectionStatus({ status: 'error', message: 'Connection test failed' })
    }
  }

  const fetchTrayStatus = async (facilityId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trays/status/${facilityId}`)
      const data = await response.json()
      
      setTrays(data.trays || [])
      setLastSync(data.last_sync)
    } catch (error) {
      console.error('Error fetching tray status:', error)
      // Mock data
      setTrays([
        {
          id: 1,
          tray_id: 'TRAY_001',
          tray_status: 'Available',
          location: 'Sterile Processing',
          last_sync: '2025-08-24T10:30:00Z'
        },
        {
          id: 2,
          tray_id: 'TRAY_002',
          tray_status: 'In Use',
          location: 'OR 3',
          last_sync: '2025-08-24T09:15:00Z'
        },
        {
          id: 3,
          tray_id: 'TRAY_003',
          tray_status: 'Cleaning',
          location: 'Decontamination',
          last_sync: '2025-08-24T08:45:00Z'
        }
      ])
      setLastSync('2025-08-24T10:30:00Z')
    } finally {
      setLoading(false)
    }
  }

  const syncTrays = async () => {
    if (!selectedFacility) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/trays/sync/${selectedFacility}`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (response.ok) {
        await fetchTrayStatus(selectedFacility)
        alert(`Sync completed: ${data.synced_count} trays updated`)
      } else {
        alert(`Sync failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Error syncing trays:', error)
      alert('Sync failed: Network error')
    } finally {
      setLoading(false)
    }
  }

  const syncAllCases = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/trays/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'both' })
      })
      
      const result = await response.json()
      setSyncStatus(result)
      
      if (result.status === 'success') {
        await fetchTrayStatus(selectedFacility) // Refresh current facility data
        alert(`Full sync completed! Synced ${result.results.synced_to_traytracker} to TrayTracker, ${result.results.synced_from_traytracker} from TrayTracker`)
      } else {
        alert(`Sync failed: ${result.error}`)
      }
    } catch (error) {
      alert('Sync operation failed')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Use':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cleaning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Maintenance':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="h-4 w-4" />
      case 'In Use':
        return <Package className="h-4 w-4" />
      case 'Cleaning':
        return <RefreshCw className="h-4 w-4" />
      case 'Maintenance':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getConnectionStatusBadge = () => {
    if (!connectionStatus) return null
    
    const statusColors = {
      connected: 'text-green-600 border-green-600',
      error: 'text-red-600 border-red-600',
      warning: 'text-yellow-600 border-yellow-600'
    }
    
    return (
      <Badge variant="outline" className={statusColors[connectionStatus.status] || statusColors.error}>
        {connectionStatus.status === 'connected' ? 'Connected to TrayTracker.com' : 'TrayTracker Disconnected'}
      </Badge>
    )
  }

  const statusSummary = trays.reduce((acc, tray) => {
    acc[tray.tray_status] = (acc[tray.tray_status] || 0) + 1
    return acc
  }, {})

  const renderOverview = () => (
    <div className="space-y-6">
      {/* TrayTracker Integration Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
            <CardTitle className="flex items-center space-x-2">
              <ArrowLeftRight className="h-5 w-5" />
              <span>TrayTracker Integration</span>
            </CardTitle>
              <CardDescription>
                Sync surgical case data with TrayTracker to prevent duplicates
              </CardDescription>
            </div>
            {getConnectionStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Connection Status</p>
              <p className="font-medium">
                {connectionStatus?.status === 'connected' ? 'Connected and Syncing' : 'Not Connected'}
              </p>
              <p className="text-xs text-gray-500">{connectionStatus?.message}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Full Sync</p>
              <p className="font-medium">
                {syncStatus?.timestamp ? new Date(syncStatus.timestamp).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={syncAllCases}
              disabled={loading || connectionStatus?.status !== 'connected'}
              className="flex items-center space-x-2"
            >
              <ArrowLeftRight className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Full Sync with TrayTracker</span>
            </Button>
            <Button
              onClick={() => setActiveTab('config')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Configure Integration</span>
            </Button>
          </div>

          {syncStatus && syncStatus.results && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Last Sync Results</h4>
              <div className="text-sm text-blue-700 grid grid-cols-2 gap-4">
                <div>To TrayTracker: {syncStatus.results.synced_to_traytracker} cases</div>
                <div>From TrayTracker: {syncStatus.results.synced_from_traytracker} cases</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facility Selection and Sync */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Facility:</span>
              </div>
              <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastSync && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Last sync: {new Date(lastSync).toLocaleString()}</span>
                </div>
              )}
              <Button 
                onClick={syncTrays} 
                disabled={loading || !selectedFacility}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Facility Trays</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      {Object.keys(statusSummary).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusSummary).map(([status, count]) => (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{status}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`p-2 rounded-full ${getStatusColor(status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tray List */}
      <Card>
        <CardHeader>
          <CardTitle>Tray Status</CardTitle>
          <CardDescription>
            Real-time status of surgical trays at the selected facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : trays.length > 0 ? (
            <div className="space-y-4">
              {trays.map((tray) => (
                <div key={tray.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${getStatusColor(tray.tray_status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                      {getStatusIcon(tray.tray_status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{tray.tray_id}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{tray.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Updated {new Date(tray.last_sync).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(tray.tray_status)} border`}>
                    {tray.tray_status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trays found</h3>
              <p className="text-gray-600 mb-4">
                {selectedFacility 
                  ? 'No trays are currently tracked for this facility.'
                  : 'Select a facility to view tray status.'}
              </p>
              {selectedFacility && (
                <Button onClick={syncTrays} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Trays
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tray Tracking</h2>
          <p className="text-gray-600">Monitor surgical tray locations and sync with TrayTracker</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'config'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            TrayTracker Configuration
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'config' && <TrayTrackerConfig />}
    </div>
  )
}

export default TrayTracking

