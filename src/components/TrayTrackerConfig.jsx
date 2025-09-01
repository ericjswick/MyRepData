import React, { useState, useEffect } from 'react'
import { Settings, Key, Globe, CheckCircle, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react'

const TrayTrackerConfig = () => {
  const [config, setConfig] = useState({
    api_base_url: '',
    client_id: 'traytracker',
    client_secret: '',
    webhook_url: '',
    sync_frequency: 15,
    auto_sync: true,
    sync_physicians: true,
    sync_facilities: true,
    sync_cases: true
  })
  
  const [showSecret, setShowSecret] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Get current domain for webhook URL
  const currentDomain = window.location.origin
  
  useEffect(() => {
    loadConfiguration()
  }, [])
  
  const loadConfiguration = async () => {
    try {
      const response = await fetch('/api/trays/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    }
  }
  
  const saveConfiguration = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/trays/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        alert('Configuration saved successfully!')
      } else {
        alert('Failed to save configuration')
      }
    } catch (error) {
      alert('Error saving configuration')
    } finally {
      setSaving(false)
    }
  }
  
  const testConnection = async () => {
    try {
      setTesting(true)
      setTestResult(null)
      
      const response = await fetch('/api/trays/connection/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Connection test failed',
        details: error.message
      })
    } finally {
      setTesting(false)
    }
  }
  
  const generateApiToken = async () => {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: config.client_id,
          client_secret: config.client_secret || 'traytracker_secret'
        })
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        alert(`API Token Generated: ${result.data.access_token}`)
      } else {
        alert('Failed to generate token')
      }
    } catch (error) {
      alert('Error generating token')
    }
  }
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }
  
  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">TrayTracker Integration Configuration</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="font-medium text-blue-800 mb-2">Integration Overview</h3>
          <p className="text-sm text-blue-700 mb-3">
            This CRM provides API endpoints that TrayTracker can use to sync physician, facility, and case data. 
            Configure the settings below to enable seamless data synchronization.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-blue-800">What TrayTracker Gets:</strong>
              <ul className="list-disc list-inside text-blue-700 mt-1">
                <li>Physician contact information</li>
                <li>Facility details and addresses</li>
                <li>Case preferences and scheduling</li>
                <li>Real-time updates via webhooks</li>
              </ul>
            </div>
            <div>
              <strong className="text-blue-800">What This CRM Gets:</strong>
              <ul className="list-disc list-inside text-blue-700 mt-1">
                <li>Surgical case schedules</li>
                <li>Tray tracking information</li>
                <li>Case completion data</li>
                <li>Implant usage reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">API Endpoints</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-3">MyRepData API Endpoints (for TrayTracker to use)</h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-mono text-green-600">GET</span>
                  <span className="ml-2 font-mono">{currentDomain}/api/physicians</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${currentDomain}/api/physicians`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-mono text-green-600">GET</span>
                  <span className="ml-2 font-mono">{currentDomain}/api/facilities</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${currentDomain}/api/facilities`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-mono text-blue-600">POST</span>
                  <span className="ml-2 font-mono">{currentDomain}/api/cases</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${currentDomain}/api/cases`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-mono text-orange-600">PUT</span>
                  <span className="ml-2 font-mono">{currentDomain}/api/cases/{'{case_id}'}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${currentDomain}/api/cases/{case_id}`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-3">Webhook Endpoints (for real-time updates)</h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-mono text-purple-600">POST</span>
                  <span className="ml-2 font-mono">{currentDomain}/webhooks/physician-updated</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${currentDomain}/webhooks/physician-updated`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-mono text-purple-600">POST</span>
                  <span className="ml-2 font-mono">{currentDomain}/webhooks/facility-updated</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${currentDomain}/webhooks/facility-updated`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Authentication */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-800">Authentication</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client ID
            </label>
            <input
              type="text"
              value={config.client_id}
              onChange={(e) => handleInputChange('client_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="traytracker"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Secret
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={config.client_secret}
                onChange={(e) => handleInputChange('client_secret', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="traytracker_secret"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={generateApiToken}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Generate API Token
          </button>
          <p className="text-xs text-gray-600 mt-2">
            Generate a Bearer token for TrayTracker to authenticate API requests
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="font-medium text-yellow-800 mb-2">Authentication Header</h4>
          <p className="text-sm text-yellow-700 mb-2">
            TrayTracker should include this header in all API requests:
          </p>
          <div className="font-mono text-sm bg-white p-2 rounded border">
            Authorization: Bearer traytracker_YYYYMMDD_HHMMSS
          </div>
        </div>
      </div>
      
      {/* Sync Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Synchronization Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sync Frequency (minutes)
            </label>
            <select
              value={config.sync_frequency}
              onChange={(e) => handleInputChange('sync_frequency', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>Every 5 minutes</option>
              <option value={15}>Every 15 minutes</option>
              <option value={30}>Every 30 minutes</option>
              <option value={60}>Every hour</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.auto_sync}
                onChange={(e) => handleInputChange('auto_sync', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Enable automatic synchronization</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.sync_physicians}
                onChange={(e) => handleInputChange('sync_physicians', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Sync physician data</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.sync_facilities}
                onChange={(e) => handleInputChange('sync_facilities', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Sync facility data</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.sync_cases}
                onChange={(e) => handleInputChange('sync_cases', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Sync case data</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Connection Test */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Connection Test</h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={testConnection}
            disabled={testing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test API Connection'}
          </button>
          
          <button
            onClick={saveConfiguration}
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
        
        {testResult && (
          <div className={`p-4 rounded-md ${
            testResult.status === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {testResult.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${
                testResult.status === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.status === 'success' ? 'Connection Successful' : 'Connection Failed'}
              </span>
            </div>
            <p className={`text-sm ${
              testResult.status === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </p>
            {testResult.details && (
              <p className="text-xs text-gray-600 mt-2">{testResult.details}</p>
            )}
          </div>
        )}
      </div>
      
      {/* Integration Instructions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Integration Instructions for TrayTracker</h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">Step 1: Authentication</h4>
            <p className="text-gray-600 mb-2">
              Generate an API token using the button above and include it in all requests:
            </p>
            <div className="font-mono text-xs bg-white p-2 rounded border">
              curl -H "Authorization: Bearer traytracker_token" {currentDomain}/api/physicians
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">Step 2: Data Sync</h4>
            <p className="text-gray-600">
              Use the API endpoints to retrieve physician and facility data. The API supports filtering by territory, 
              specialty, and incremental sync using the updated_since parameter.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">Step 3: Real-time Updates</h4>
            <p className="text-gray-600">
              Configure webhooks to receive real-time notifications when data changes in this CRM. 
              This ensures both systems stay synchronized without constant polling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrayTrackerConfig

